import { Router } from "express";
import { availabilitiesRoutes } from "./availability.routes";
import { eventsRoutes } from "./event.routes";
import { heatmapRoutes } from "./heatmap.routes";
import { participantsRoutes } from "./participant.routes";
import { timeSlotsRoutes } from "./timeSlot.routes";

const router = Router();

router.use("/events", eventsRoutes);
router.use("/participants", participantsRoutes);
router.use("/timeslots", timeSlotsRoutes);
router.use("/availabilities", availabilitiesRoutes);
router.use("/heatmap", heatmapRoutes);

export const routes = router;
