import { Prisma } from '@prisma/client';

export const baseUserQuery: Prisma.UserSelect = {
  id: true,
  profile: {
    select: {
      displayName: true,
      avatarImageUrl: true,
      bio: true,
    },
  },
};

export const baseUserQueryWithSocialLinks: Prisma.UserSelect = {
  id: true,
  profile: {
    select: {
      displayName: true,
      avatarImageUrl: true,
      bio: true,
      socialLinks: {
        select: {
          website: true,
          instagram: true,
          facebook: true,
        },
      },
    },
  },
};
