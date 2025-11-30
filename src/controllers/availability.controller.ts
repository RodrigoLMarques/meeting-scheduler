import { NextFunction, Request, Response } from "express";
import { availabilityService } from "../services/availability.service";

class AvailabilityController {
  async getByParticipantId(req: Request, res: Response, next: NextFunction) {
    try {
      const availabilities = await availabilityService.getByParticipantId(
        req.params.participantId
      );
      return res
        .status(200)
        .json(availabilities.map((availability) => availability.toJSON()));
    } catch (error) {
      next(error);
    }
  }

  async getByTimeSlotId(req: Request, res: Response, next: NextFunction) {
    try {
      const availabilities = await availabilityService.getByTimeSlotId(
        req.params.timeSlotId
      );
      return res
        .status(200)
        .json(availabilities.map((availability) => availability.toJSON()));
    } catch (error) {
      next(error);
    }
  }

  async setAvailabilities(req: Request, res: Response, next: NextFunction) {
    try {
      const availabilities = await availabilityService.setAvailabilities({
        ...req.body,
        participant: req.participant,
      });
      return res.status(200).json({
        message: `${availabilities.length} disponibilidades definidas com sucesso`,
        count: availabilities.length,
        availabilities: availabilities.map((availability) =>
          availability.toJSON()
        ),
      });
    } catch (error) {
      next(error);
    }
  }
}

export const availabilityController = new AvailabilityController();
