import { Router } from "express";
import { availabilityController } from "../controllers/availability.controller";
import { authenticateToken } from "../middlewares/auth.middleware";

const router = Router();

router.get(
  "/participant/:participantId",
  availabilityController.getByParticipantId
);
router.get("/timeslot/:timeSlotId", availabilityController.getByTimeSlotId);
router.post(
  "/set",
  authenticateToken,
  availabilityController.setAvailabilities
);

export const availabilitiesRoutes = router;
