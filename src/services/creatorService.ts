/* eslint-disable @typescript-eslint/no-explicit-any */
import db from '@/db';

type getCreatorsPayload = {
  page?: number;
  pageSize?: number;
  type?: 'common' | 'hot' | 'random';
  searchName?: string;
};

const getCreators = async ({ page = 1, pageSize = 10, type = 'common', searchName = '' }: getCreatorsPayload) => {
  let orderBy: any = {};

  switch (type) {
    case 'hot':
      orderBy = {
        follows: {
          _count: 'desc',
        },
      };
      break;
    case 'random':
      // TODO: Implement random order
      break;
    default:
      orderBy = {
        id: 'asc',
      };
      break;
  }

  const creatorsDetails = await db.user.findMany({
    where: {
      profile: {
        displayName: {
          contains: searchName,
          mode: 'insensitive',
        },
      },
    },
    select: {
      id: true,
      email: true,
      profile: {
        select: {
          avatarImageUrl: true,
          displayName: true,
          socialLinks: {
            select: {
              website: true,
              instagram: true,
              facebook: true,
            },
          },
        },
      },
      follows: {
        select: {
          followingId: true,
        },
      },
      followedBy: {
        select: {
          followerId: true,
        },
      },
    },
    orderBy,
    skip: (page - 1) * pageSize,
    take: pageSize,
  });

  const creators = creatorsDetails.map((creator) => ({
    userId: creator.id,
    email: creator.email,
    ...creator.profile,
    followers: creator.follows,
    followings: creator.followedBy,
  }));

  return creators;
};

export default {
  getCreators,
};
