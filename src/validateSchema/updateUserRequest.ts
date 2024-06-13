import { z } from 'zod';

export const updateUserRequestSchema = z.object({
  displayName: z.string().max(50).optional(),
  avatarImageUrl: z.string().optional(),
  bio: z.string().optional(),
  socialLinks: z
    .object({
      website: z.string().url().optional(),
      instagram: z.string().url().optional(),
      facebook: z.string().url().optional(),
    })
    .optional(),
});

export type UpdateUserRequest = z.infer<typeof updateUserRequestSchema>;
