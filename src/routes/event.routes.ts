import { Router } from 'express';
import { eventController } from '../controllers/event.controller';

const router = Router();

router.get('/', eventController.getAll);
router.post('/', eventController.create);

export const eventsRoutes = router;