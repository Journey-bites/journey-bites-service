import { Router } from 'express';
import { z } from 'zod';

import { passwordSchema } from '@/constants/schema';
import authController from '@/controllers/authController';
import validateData from '@/middlewares/validateData';
import authenticate from '@/middlewares/authenticate';

const registerSchema = z.object({
  email: z.string().email(),
  password: passwordSchema,
  displayName: z.string().max(50),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: passwordSchema,
});

const checkEmailSchema = z.object({
  email: z.string().email(),
});

const resetPasswordSchema = z.object({
  password: passwordSchema,
});

const router = Router();

router.post('/register', validateData(registerSchema), authController.register);
router.post('/login', validateData(loginSchema), authController.login);
router.post('/verify-email', validateData(checkEmailSchema), authController.verifyEmail);

// need to be authenticated to access these routes
router.post('/logout', authenticate, authController.logout);
router.patch('/reset-password', authenticate, validateData(resetPasswordSchema), authController.resetPassword);

export default router;
