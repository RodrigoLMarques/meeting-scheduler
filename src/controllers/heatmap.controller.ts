import { NextFunction, Request, Response } from "express";
import { heatmapService } from "../services/heatmap.service";

class HeatmapController {
  async getHeatmapByEvent(req: Request, res: Response, next: NextFunction) {
    try {
      const heatmap = await heatmapService.getHeatmapByEvent(
        req.params.eventId
      );
      return res.status(200).json(heatmap);
    } catch (error) {
      next(error);
    }
  }
}

export const heatmapController = new HeatmapController();
