import { z } from 'zod';

export const categoryRequestSchema = z.object({
  name: z.string(),
  path: z.string().startsWith('/'),
  description: z.string().optional(),
});

export type CategoryRequest = z.infer<typeof categoryRequestSchema>;
