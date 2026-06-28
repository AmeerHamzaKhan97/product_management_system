import { Router } from 'express';
import { authController } from '../controllers/auth.controller';
import { loginValidator } from '../validators/auth.validator';

const router = Router();

router.post('/login', loginValidator, authController.login);

export default router;
