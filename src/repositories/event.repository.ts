import { PrismaClient } from "@prisma/client";
import { Event } from "../entities/event";

const prisma = new PrismaClient();

export class EventRepository {
  async findAll(): Promise<Event[]> {
    const events = await prisma.event.findMany();
    return events.map(
      (data) =>
        new Event(
          data.id,
          data.title,
          data.description || "",
          data.date_start,
          data.date_end,
          data.time_earliest,
          data.time_latest,
          data.timezone,
          data.url_slug
        )
    );
  }

  async findById(id: string): Promise<Event | null> {
    const event = await prisma.event.findUnique({
      where: { id },
    });

    if (!event) {
      return null;
    }

    return new Event(
      event.id,
      event.title,
      event.description || "",
      event.date_start,
      event.date_end,
      event.time_earliest,
      event.time_latest,
      event.timezone,
      event.url_slug
    );
  }

  async findBySlug(url_slug: string): Promise<Event | null> {
    const event = await prisma.event.findUnique({
      where: { url_slug },
    });

    if (!event) {
      return null;
    }

    return new Event(
      event.id,
      event.title,
      event.description || "",
      event.date_start,
      event.date_end,
      event.time_earliest,
      event.time_latest,
      event.timezone,
      event.url_slug
    );
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
        url_slug: event.url_slug,
      },
    });
  }

  async update(event: Event): Promise<void> {
    await prisma.event.update({
      where: { id: event.id },
      data: {
        title: event.title,
        description: event.description,
        date_start: event.date_start,
        date_end: event.date_end,
        time_earliest: event.time_earliest,
        time_latest: event.time_latest,
        timezone: event.timezone,
        url_slug: event.url_slug,
      },
    });
  }

  async delete(id: string): Promise<void> {
    await prisma.availability.deleteMany({
      where: { participant: { event_id: id } },
    });
    await prisma.timeSlot.deleteMany({
      where: { event_id: id },
    });
    await prisma.participant.deleteMany({
      where: { event_id: id },
    });
    await prisma.event.delete({
      where: { id },
    });
  }
}
