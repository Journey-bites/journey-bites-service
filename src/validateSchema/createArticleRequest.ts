import { z } from 'zod';

const urlOrEmptyString = z.string().refine((val) => val === '' || z.string().url().safeParse(val).success);

export const createArticleBodySchema = z.object({
  title: z.string().min(1),
  abstract: z.string(),
  content: z.string(),
  isNeedPay: z.boolean(),
  wordCount: z.number(),
  category: z.string(),
  thumbnailUrl: urlOrEmptyString.optional().nullable(),
  tags: z.array(z.string()).optional(),
});

export type CreateArticleRequestBody = z.infer<typeof createArticleBodySchema>;
