import { Router } from "express";
import { participantController } from "../controllers/participant.controller";

const router = Router();

router.get("/:id", participantController.getById);
router.get("/event/:eventId", participantController.getByEventId);
router.post("/", participantController.create);
router.post("/login", participantController.login);
router.put("/:id", participantController.update);
router.delete("/:id", participantController.delete);

export const participantsRoutes = router;
