import { z } from 'zod';

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];

export const fileRequestSchema = z.object({
  file: z
    .any()
    .refine((file) => file?.size > 0 && Boolean(file), { message: 'Image is required.' })
    .refine((file) => file?.size <= MAX_FILE_SIZE, 'Max image size is 5MB.')
    .refine(
      (file) => ACCEPTED_IMAGE_TYPES.includes(file?.type),
      'Only .jpg, .jpeg, .png, .webp and .gif formats are supported.'
    ),
});

export type FileRequestBody = z.infer<typeof fileRequestSchema>;
