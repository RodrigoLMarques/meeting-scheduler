import { PrismaClient } from "@prisma/client";
import { Event } from "../entities/event";

const prisma = new PrismaClient();

export class EventRepository {
  async findAll(): Promise<Event[]> {
    const events = await prisma.event.findMany();
    return events.map((data) => new Event(data.title, data.date_start, data.date_end, data.time_earliest, data.time_latest, data.timezone));
  }

  async create(event: Event): Promise<void> {
    await prisma.event.create({
      data: {
      id: event.id,
      title: event.title,
      description: event.description,
      date_start: event.date_start,
      date_end: event.date_end,
      time_earliest: event.time_earliest,
      time_latest: event.time_latest,
      timezone: event.timezone,
      url_slug: event.timezone
      },
    });
  }
}
