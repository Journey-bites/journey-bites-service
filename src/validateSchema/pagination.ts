import { z } from 'zod';

export const paginationSchema = z.object({
  page: z
    .string()
    .transform((val) => parseInt(val, 10))
    .catch(1),
  pageSize: z
    .string()
    .transform((val) => parseInt(val))
    .catch(10),
});

export type Pagination = z.infer<typeof paginationSchema>;
