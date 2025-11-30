import { NextFunction, Request, Response } from "express";
import { timeSlotService } from "../services/timeSlot.service";

class TimeSlotController {

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const timeSlot = await timeSlotService.getById(req.params.id);
      return res.status(200).json(timeSlot.toJSON());
    } catch (error) {
      next(error);
    }
  }

  async getByEventId(req: Request, res: Response, next: NextFunction) {
    try {
      const timeSlots = await timeSlotService.getByEventId(req.params.eventId);
      return res
        .status(200)
        .json(timeSlots.map((timeSlot) => timeSlot.toJSON()));
    } catch (error) {
      next(error);
    }
  }
}

export const timeSlotController = new TimeSlotController();
