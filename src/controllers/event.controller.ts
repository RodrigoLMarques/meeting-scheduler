import { NextFunction, Request, Response } from "express";
import { eventService } from "../services/event.service";

class EventController {
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const event = await eventService.getAll();
      return res.status(200).json(event.map((event) => event.toJSON()));
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const event = await eventService.create(req.body);
      return res.status(201).json(event.toJSON());
    } catch (error) {
      next(error);
    }
  }
}

export const eventController = new EventController();
