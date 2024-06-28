import { z } from 'zod';

export const createArticleBodySchema = z.object({
  title: z.string().min(1),
  abstract: z.string(),
  content: z.string(),
  isNeedPay: z.boolean(),
  wordCount: z.number(),
  category: z.string(),
  thumbnailUrl: z.string().url().or(z.literal('')).optional(),
  tags: z.array(z.string()).optional(),
});

export type CreateArticleRequestBody = z.infer<typeof createArticleBodySchema>;
