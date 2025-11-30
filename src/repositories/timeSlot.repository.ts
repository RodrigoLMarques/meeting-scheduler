import { PrismaClient } from "@prisma/client";
import { TimeSlot } from "../entities/timeSlot";

const prisma = new PrismaClient();

export class TimeSlotRepository {
  async findById(id: string): Promise<TimeSlot | null> {
    const timeSlot = await prisma.timeSlot.findUnique({
      where: { id },
    });

    if (!timeSlot) {
      return null;
    }

    return new TimeSlot(
      timeSlot.id,
      timeSlot.event_id,
      timeSlot.start_time,
      timeSlot.end_time,
    );
  }

  async findByEventId(event_id: string): Promise<TimeSlot[]> {
    const timeSlots = await prisma.timeSlot.findMany({
      where: { event_id },
      orderBy: { start_time: "asc" },
    });

    return timeSlots.map(
      (data) =>
        new TimeSlot(data.id, data.event_id, data.start_time, data.end_time),
    );
  }

  async findByEventAndStartTime(
    event_id: string,
    start_time: Date,
  ): Promise<TimeSlot | null> {
    const timeSlot = await prisma.timeSlot.findUnique({
      where: {
        event_id_start_time: {
          event_id,
          start_time,
        },
      },
    });

    if (!timeSlot) {
      return null;
    }

    return new TimeSlot(
      timeSlot.id,
      timeSlot.event_id,
      timeSlot.start_time,
      timeSlot.end_time,
    );
  }

  async create(timeSlot: TimeSlot): Promise<void> {
    await prisma.timeSlot.create({
      data: {
        id: timeSlot.id,
        event_id: timeSlot.event_id,
        start_time: timeSlot.start_time,
        end_time: timeSlot.end_time,
      },
    });
  }

  async update(timeSlot: TimeSlot): Promise<void> {
    await prisma.timeSlot.update({
      where: { id: timeSlot.id },
      data: {
        start_time: timeSlot.start_time,
        end_time: timeSlot.end_time,
      },
    });
  }

  async delete(id: string): Promise<void> {
    await prisma.timeSlot.delete({
      where: { id },
    });
  }

  async validateTimeSlotsByIds(ids: string[]): Promise<boolean> {
    const count = await prisma.timeSlot.count({
      where: {
        id: {
          in: ids,
        },
      },
    });

    return count === ids.length;
  }
}
