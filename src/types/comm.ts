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
