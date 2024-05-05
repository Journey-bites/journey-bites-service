import { Router } from 'express';
import { z } from 'zod';

import authController from '@/controllers/authController';
import validateData from '@/middlewares/validateData';

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

const router = Router();

router.post('/register', validateData(registerSchema), authController.register);
router.post('/login', validateData(loginSchema), authController.login);

export default router;
