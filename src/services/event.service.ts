import { Event } from "../entities/event";
import { TimeSlot } from "../entities/timeSlot";
import { ConflictError, NotFoundError } from "../exceptions/appError";
import { EventRepository } from "../repositories/event.repository";
import { TimeSlotRepository } from "../repositories/timeSlot.repository";

export interface ICreateEventDTO {
  title: string;
  description?: string;
  date_start: Date | string;
  date_end: Date | string;
  time_earliest?: string;
  time_latest?: string;
  timezone?: string;
}

export interface IUpdateEventDTO {
  title?: string;
  description?: string;
  date_start?: Date | string;
  date_end?: Date | string;
  time_earliest?: string;
  time_latest?: string;
  timezone?: string;
}

class EventService {
  private eventRepository: EventRepository;
  private timeSlotRepository: TimeSlotRepository;

  constructor() {
    this.eventRepository = new EventRepository();
    this.timeSlotRepository = new TimeSlotRepository();
  }

  async getAll(): Promise<Event[]> {
    const events = await this.eventRepository.findAll();
    return events;
  }

  async getById(id: string): Promise<Event> {
    const event = await this.eventRepository.findById(id);

    if (!event) {
      throw new NotFoundError("Evento não encontrado");
    }

    return event;
  }

  async getBySlug(url_slug: string): Promise<Event> {
    const event = await this.eventRepository.findBySlug(url_slug);

    if (!event) {
      throw new NotFoundError("Evento não encontrado");
    }

    return event;
  }

  async create(data: ICreateEventDTO): Promise<Event> {
    const existingEvent = await this.eventRepository.findBySlug(
      this.generateSlug(data.title),
    );

    if (existingEvent) {
      throw new ConflictError("Já existe um evento com este título");
    }

    // Converter strings para Date se necessário
    const dateStart = typeof data.date_start === 'string'
      ? new Date(data.date_start)
      : data.date_start;

    const dateEnd = typeof data.date_end === 'string'
      ? new Date(data.date_end)
      : data.date_end;

    const event = new Event(
      crypto.randomUUID(),
      data.title,
      data.description || "",
      dateStart,
      dateEnd,
      data.time_earliest,
      data.time_latest,
      data.timezone,
    );

    await this.eventRepository.create(event);
    await this.generateTimeSlots(event);

    return event;
  }

  async generateTimeSlots(event: Event): Promise<TimeSlot[]> {
    const timeSlots: TimeSlot[] = [];
    const SLOT_DURATION_MINUTES = 30;

    const [earliestHour, earliestMinute] = event.time_earliest
      .split(":")
      .map(Number);
    const [latestHour, latestMinute] = event.time_latest.split(":").map(Number);

    const currentDate = new Date(event.date_start);
    const endDate = new Date(event.date_end);

    while (currentDate <= endDate) {
      const startTime = new Date(currentDate);
      startTime.setHours(earliestHour, earliestMinute, 0, 0);

      const endTime = new Date(currentDate);
      endTime.setHours(latestHour, latestMinute, 0, 0);

      let slotStart = new Date(startTime);

      while (slotStart < endTime) {
        const slotEnd = new Date(slotStart);
        slotEnd.setMinutes(slotEnd.getMinutes() + SLOT_DURATION_MINUTES);

        if (slotEnd <= endTime) {
          const timeSlot = new TimeSlot(
            crypto.randomUUID(),
            event.id,
            new Date(slotStart),
            new Date(slotEnd),
          );

          await this.timeSlotRepository.create(timeSlot);
          timeSlots.push(timeSlot);
        }

        slotStart = slotEnd;
      }

      currentDate.setDate(currentDate.getDate() + 1);
    }

    return timeSlots;
  }

  async update(id: string, data: IUpdateEventDTO): Promise<Event> {
    const event = await this.eventRepository.findById(id);

    if (!event) {
      throw new NotFoundError("Evento não encontrado");
    }

    if (data.title !== undefined) {
      const newSlug = this.generateSlug(data.title);
      if (newSlug !== event.url_slug) {
        const existingEvent = await this.eventRepository.findBySlug(newSlug);
        if (existingEvent && existingEvent.id !== id) {
          throw new ConflictError("Já existe um evento com este título");
        }
      }
      event.title = data.title;
    }

    if (data.description !== undefined) {
      event.description = data.description;
    }

    if (data.date_start !== undefined) {
      event.date_start = typeof data.date_start === 'string'
        ? new Date(data.date_start)
        : data.date_start;
    }

    if (data.date_end !== undefined) {
      event.date_end = typeof data.date_end === 'string'
        ? new Date(data.date_end)
        : data.date_end;
    }

    if (data.time_earliest !== undefined) {
      event.time_earliest = data.time_earliest;
    }

    if (data.time_latest !== undefined) {
      event.time_latest = data.time_latest;
    }

    if (data.timezone !== undefined) {
      event.timezone = data.timezone;
    }

    await this.eventRepository.update(event);

    return event;
  }

  async delete(id: string): Promise<void> {
    const event = await this.eventRepository.findById(id);

    if (!event) {
      throw new NotFoundError("Evento não encontrado");
    }

    await this.eventRepository.delete(id);
  }

  private generateSlug(text: string): string {
    return text
      .toLowerCase()
      .trim()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-");
  }
}

export const eventService = new EventService();
