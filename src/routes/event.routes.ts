import { Router } from "express";
import { eventController } from "../controllers/event.controller";

const router = Router();

router.get("/", eventController.getAll);
router.get("/:id", eventController.getById);
router.get("/slug/:slug", eventController.getBySlug);
router.post("/", eventController.create);
router.put("/:id", eventController.update);
router.delete("/:id", eventController.delete);

export const eventsRoutes = router;
