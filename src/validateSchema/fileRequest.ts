import { z } from 'zod';

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];

export const imageFileRequestSchema = z.object({
  fieldname: z.string(),
  originalname: z.string(),
  encoding: z.string(),
  mimetype: z
    .string()
    .refine(
      (mimetype) => ACCEPTED_IMAGE_TYPES.includes(mimetype),
      'Only .jpg, .jpeg, .png, .webp and .gif formats are supported.'
    ),
  buffer: z.instanceof(Buffer).refine((buffer) => buffer.length > 0 && buffer, 'Image is required.'),
  size: z.number().refine((size) => size <= MAX_FILE_SIZE, 'Max image size is 5MB.'),
});
