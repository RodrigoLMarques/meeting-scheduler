import { Router } from 'express';
import { userController } from '../controllers/user.controller';

const router = Router();

router.get('/', userController.getAll);
router.post('/', userController.create);

export const userRoutes = router;
