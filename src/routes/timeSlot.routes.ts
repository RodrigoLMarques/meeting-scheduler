import { Router } from "express";
import { timeSlotController } from "../controllers/timeSlot.controller";

const router = Router();

router.get("/:id", timeSlotController.getById);
router.get("/event/:eventId", timeSlotController.getByEventId);

export const timeSlotsRoutes = router;
