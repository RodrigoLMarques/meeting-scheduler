import { NextFunction, Request, Response } from "express";
import { eventService } from "../services/event.service";

class EventController {
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const events = await eventService.getAll();
      return res.status(200).json(events.map((event) => event.toJSON()));
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const event = await eventService.getById(req.params.id);
      return res.status(200).json(event.toJSON());
    } catch (error) {
      next(error);
    }
  }

  async getBySlug(req: Request, res: Response, next: NextFunction) {
    try {
      const event = await eventService.getBySlug(req.params.slug);
      return res.status(200).json(event.toJSON());
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

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const event = await eventService.update(req.params.id, req.body);
      return res.status(200).json(event.toJSON());
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await eventService.delete(req.params.id);
      return res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}

export const eventController = new EventController();
