import { z } from 'zod';

export const commentRequestBodySchema = z.object({
  content: z.string().min(1),
});

export type CommentRequestBody = z.infer<typeof commentRequestBodySchema>;
