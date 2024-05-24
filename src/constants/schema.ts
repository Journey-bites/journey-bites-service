import { z } from 'zod';

export const passwordSchema = z
  .string()
  .regex(/^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]{6,20}$/, { message: 'password format is invalid' });
