import { NextFunction, Request, Response } from "express";
import { participantService } from "../services/participant.service";

class ParticipantController {
  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const participant = await participantService.getById(req.params.id);
      return res.status(200).json(participant.toJSON());
    } catch (error) {
      next(error);
    }
  }

  async getByEventId(req: Request, res: Response, next: NextFunction) {
    try {
      const participants = await participantService.getByEventId(
        req.params.eventId,
      );
      return res
        .status(200)
        .json(participants.map((participant) => participant.toJSON()));
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const participant = await participantService.create(req.body);
      return res.status(201).json(participant.toJSON());
    } catch (error) {
      next(error);
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await participantService.login(req.body);
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const participant = await participantService.update(
        req.params.id,
        req.body,
      );
      return res.status(200).json(participant.toJSON());
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await participantService.delete(req.params.id);
      return res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}

export const participantController = new ParticipantController();
