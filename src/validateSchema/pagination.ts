import { z } from 'zod';

export const paginationSchema = z.object({
  page: z
    .string()
    .transform((page) => parseInt(page))
    .catch(1),
  pageSize: z
    .string()
    .transform((limit) => parseInt(limit))
    .catch(10),
});

export type Pagination = z.infer<typeof paginationSchema>;
