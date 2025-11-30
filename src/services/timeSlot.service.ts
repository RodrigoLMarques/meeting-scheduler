import { TimeSlot } from "../entities/timeSlot";
import { ConflictError, NotFoundError } from "../exceptions/appError";
import { TimeSlotRepository } from "../repositories/timeSlot.repository";
import { EventRepository } from "../repositories/event.repository";

export interface ICreateTimeSlotDTO {
  event_id: string;
  start_time: Date | string;
  end_time: Date | string;
}

export interface IUpdateTimeSlotDTO {
  start_time?: Date | string;
  end_time?: Date | string;
}

class TimeSlotService {
  private timeSlotRepository: TimeSlotRepository;
  private eventRepository: EventRepository;

  constructor() {
    this.timeSlotRepository = new TimeSlotRepository();
    this.eventRepository = new EventRepository();
  }

  async getById(id: string): Promise<TimeSlot> {
    const timeSlot = await this.timeSlotRepository.findById(id);

    if (!timeSlot) {
      throw new NotFoundError("Slot de tempo não encontrado");
    }

    return timeSlot;
  }

  async getByEventId(event_id: string): Promise<TimeSlot[]> {
    const timeSlots = await this.timeSlotRepository.findByEventId(event_id);
    return timeSlots;
  }

  async create(data: ICreateTimeSlotDTO): Promise<TimeSlot> {
    const event = await this.eventRepository.findById(data.event_id);

    if (!event) {
      throw new NotFoundError("Evento não encontrado");
    }

    // Converter strings para Date se necessário
    const startTime = typeof data.start_time === 'string'
      ? new Date(data.start_time)
      : data.start_time;

    const endTime = typeof data.end_time === 'string'
      ? new Date(data.end_time)
      : data.end_time;

    const existingTimeSlot =
      await this.timeSlotRepository.findByEventAndStartTime(
        data.event_id,
        startTime,
      );

    if (existingTimeSlot) {
      throw new ConflictError(
        "Já existe um slot de tempo com este horário de início neste evento",
      );
    }

    const timeSlot = new TimeSlot(
      crypto.randomUUID(),
      data.event_id,
      startTime,
      endTime,
    );

    await this.timeSlotRepository.create(timeSlot);

    return timeSlot;
  }

  async update(id: string, data: IUpdateTimeSlotDTO): Promise<TimeSlot> {
    const timeSlot = await this.timeSlotRepository.findById(id);

    if (!timeSlot) {
      throw new NotFoundError("Slot de tempo não encontrado");
    }

    if (data.start_time !== undefined) {
      const startTime = typeof data.start_time === 'string'
        ? new Date(data.start_time)
        : data.start_time;

      const existingTimeSlot =
        await this.timeSlotRepository.findByEventAndStartTime(
          timeSlot.event_id,
          startTime,
        );

      if (existingTimeSlot && existingTimeSlot.id !== id) {
        throw new ConflictError(
          "Já existe um slot de tempo com este horário de início neste evento",
        );
      }

      timeSlot.start_time = startTime;
    }

    if (data.end_time !== undefined) {
      timeSlot.end_time = typeof data.end_time === 'string'
        ? new Date(data.end_time)
        : data.end_time;
    }

    await this.timeSlotRepository.update(timeSlot);

    return timeSlot;
  }

  async delete(id: string): Promise<void> {
    const timeSlot = await this.timeSlotRepository.findById(id);

    if (!timeSlot) {
      throw new NotFoundError("Slot de tempo não encontrado");
    }

    await this.timeSlotRepository.delete(id);
  }
}

export const timeSlotService = new TimeSlotService();
