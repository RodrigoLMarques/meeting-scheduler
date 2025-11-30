import { Router } from "express";
import { availabilityController } from "../controllers/availability.controller";

const router = Router();

router.get(
  "/participant/:participantId",
  availabilityController.getByParticipantId
);
router.get("/timeslot/:timeSlotId", availabilityController.getByTimeSlotId);
router.post("/set", availabilityController.setAvailabilities);
router.delete(
  "/participant/:participantId",
  availabilityController.deleteByParticipantId
);

export const availabilitiesRoutes = router;
