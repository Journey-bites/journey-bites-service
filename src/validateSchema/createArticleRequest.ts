import { z } from 'zod';

export const createArticleBodySchema = z.object({
  title: z.string().min(1),
  abstract: z.string(),
  content: z.string(),
  thumbnailUrl: z.string().url(),
  isNeedPay: z.boolean(),
  wordCount: z.number(),
  tags: z.array(z.string()),
});

export type CreateArticleRequestBody = z.infer<typeof createArticleBodySchema>;
