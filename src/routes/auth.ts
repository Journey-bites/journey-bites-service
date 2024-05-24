import { Router } from 'express';
import { z } from 'zod';

import authController from '@/controllers/authController';
import validateData from '@/middlewares/validateData';

const passwordSchema = z
  .string()
  .regex(/^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]{6,20}$/, { message: 'password format is invalid' });

const registerSchema = z.object({
  email: z.string().email(),
  password: passwordSchema,
  displayName: z.string().max(50),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: passwordSchema,
});

const router = Router();

router.post('/register', validateData(registerSchema), authController.register);
router.post('/login', validateData(loginSchema), authController.login);

export default router;
