import { Router } from 'express';
import { z } from 'zod';

import authController from '@/controllers/authController';
import validateData from '@/middlewares/validateData';
import authenticate from '@/middlewares/authenticate';

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

const checkEmailSchema = z.object({
  email: z.string().email(),
});

const router = Router();

router.post('/register', validateData(registerSchema), authController.register);
router.post('/login', validateData(loginSchema), authController.login);
router.post('/verify-email', validateData(checkEmailSchema), authController.verifyEmail);
router.post('/logout', authenticate, authController.logout);

export default router;
