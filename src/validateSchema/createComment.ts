import { z } from 'zod';

export const createCommentBodySchema = z.object({
  content: z.string().min(1),
});

export type CreateCommentRequestBody = z.infer<typeof createCommentBodySchema>;
