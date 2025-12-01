import { Event } from "../entities/event";
import { NotFoundError } from "../exceptions/appError";
import { EventRepository } from "../repositories/event.repository";
import { timeSlotService } from "./timeSlot.service";

export interface ICreateEventDTO {
  title: string;
  description?: string;
  date_start: string;
  date_end: string;
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

  constructor() {
    this.eventRepository = new EventRepository();
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
    const dateStart =
      typeof data.date_start === "string"
        ? new Date(data.date_start)
        : data.date_start;

    const dateEnd =
      typeof data.date_end === "string"
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
    await timeSlotService.generateTimeSlotsForEvent(event);

    return event;
  }

  async update(id: string, data: IUpdateEventDTO): Promise<Event> {
    const event = await this.eventRepository.findById(id);

    if (!event) {
      throw new NotFoundError("Evento não encontrado");
    }

    if (data.title !== undefined) {
      event.title = data.title;
    }
    if (data.description !== undefined) {
      event.description = data.description;
    }
    if (data.date_start !== undefined) {
      event.date_start =
        typeof data.date_start === "string"
          ? new Date(data.date_start)
          : data.date_start;
    }
    if (data.date_end !== undefined) {
      event.date_end =
        typeof data.date_end === "string"
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
}

export const eventService = new EventService();
