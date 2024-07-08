import { Prisma } from '@prisma/client';

export const baseUserProfileQuery: Prisma.UserSelect['profile'] = {
  select: {
    displayName: true,
    avatarImageUrl: true,
    bio: true,
  },
};

export const baseUserProfileQueryWithSocialLinks: Prisma.UserSelect['profile'] = {
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
};
