import { Router } from "express";
import { participantController } from "../controllers/participant.controller";
import { authenticateToken } from "../middlewares/auth.middleware";

const router = Router();

router.get("/:id", participantController.getById);
router.get("/event/:eventId", participantController.getByEventId);
router.post("/", participantController.create);
router.post("/login", participantController.login);
router.delete("/:id", authenticateToken, participantController.delete);

export const participantsRoutes = router;
