import bcrypt from "bcrypt";
import { Event } from "../entities/event";
import { ConflictError } from "../exceptions/appError";
import { EventRepository } from "../repositories/event.repository";

export interface ICreateEventDTO {    
    title: string;
    description: string;
    date_start: Date;
    date_end: Date;
    time_earliest: string;
    time_latest: string;
    timezone: string;
    url_slug: string;
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

  async create(data: ICreateEventDTO): Promise<Event> {
    const { title, description, date_start, date_end, time_earliest, time_latest, timezone, url_slug } = data;
        if (!title || title.trim().length < 3) {
            throw new Error("O título deve ter pelo menos 3 caracteres.");
        }

        if (!(date_start instanceof Date) || isNaN(date_start.getTime())) {
            throw new Error("dateStart inválido.");
        }

        if (!(date_end instanceof Date) || isNaN(date_end.getTime())) {
            throw new Error("dateEnd inválido.");
        }

        if (date_end <= date_start) {
            throw new Error("dateEnd deve ser posterior a dateStart.");
        }

        const timePattern = /^([01]\d|2[0-3]):([0-5]\d)$/;

        if (!timePattern.test(time_earliest)) {
            throw new Error("time_earliest deve estar no formato HH:mm");
        }

        if (!timePattern.test(time_latest)) {
            throw new Error("time_latest deve estar no formato HH:mm");
        }

    const event = new Event(data.title, data.date_start, data.date_end, data.description, data.time_earliest, data.time_latest, data.timezone);
    await this.eventRepository.create(event);

    return event;
  }
}

export const eventService = new EventService();
