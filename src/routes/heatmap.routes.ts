import { Router } from "express";
import { heatmapController } from "../controllers/heatmap.controller";

const router = Router();

router.get("/event/:eventId", heatmapController.getHeatmapByEvent);

export const heatmapRoutes = router;
