import { Profile, SocialLinks } from '@prisma/client';

export type Meta = {
  page: number;
  totalPage: number;
  totalData: number;
  pageSize: number;
};

export type BaseResponse<T> = {
  statusCode: number;
  message: string;
  data?: T;
  meta?: Meta;
};

export type UserProfile = Omit<Profile, 'id' | 'socialLinksId'> & { socialLinks: Partial<SocialLinks> };

// Optimize this type in the future
export type GetCreatorInfoData = {
  followersCount: number;
  userId: string;
  email: string;
  displayName?: string;
  avatarImageUrl?: string | null;
  bio?: string | null;
  socialLinks?: {
    website: string | null;
    instagram: string | null;
    facebook: string | null;
  } | null;
  userAlreadyFollowed?: boolean;
};
