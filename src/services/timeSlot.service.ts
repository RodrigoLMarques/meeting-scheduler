import { Event } from "../entities/event";
import { TimeSlot } from "../entities/timeSlot";
import { NotFoundError } from "../exceptions/appError";
import { EventRepository } from "../repositories/event.repository";
import { TimeSlotRepository } from "../repositories/timeSlot.repository";

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

  constructor() {
    this.timeSlotRepository = new TimeSlotRepository();
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

  async generateTimeSlotsForEvent(event: Event): Promise<TimeSlot[]> {
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
}

export const timeSlotService = new TimeSlotService();
