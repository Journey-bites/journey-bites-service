/* eslint-disable @typescript-eslint/no-explicit-any */
import db from '@/db';
import { HttpException } from '@/exceptions/HttpException';

type GetCreatorsPayload = {
  page?: number;
  pageSize?: number;
  type?: 'common' | 'hot' | 'random';
  keyword?: string;
};

const generateRandomOrder = () => (Math.random() > 0.5 ? 'asc' : 'desc');

const generateRandomOrderCondition = () => {
  const randomOrder = Math.floor(Math.random() * 5);
  switch (randomOrder) {
    case 0:
      return {
        profile: {
          avatarImageUrl: generateRandomOrder(),
        },
      };
    case 1:
      return {
        profile: {
          socialLinks: {
            website: generateRandomOrder(),
          },
        },
      };
    case 2:
      return {
        profile: {
          socialLinks: {
            instagram: generateRandomOrder(),
          },
        },
      };
    case 3:
      return {
        profile: {
          socialLinks: {
            facebook: generateRandomOrder(),
          },
        },
      };
    case 4:
      return {
        updatedAt: generateRandomOrder(),
      };
    default:
      return {
        id: generateRandomOrder(),
      };
  }
};

const getCreators = async ({ page = 1, pageSize = 10, type = 'common', keyword = '' }: GetCreatorsPayload) => {
  let orderBy: any = {};

  const randomOrderBy = generateRandomOrderCondition();

  switch (type) {
    case 'hot':
      orderBy = {
        follows: {
          _count: 'desc',
        },
      };
      break;
    case 'random':
      orderBy = {
        ...randomOrderBy,
      };
      break;
    default:
      orderBy = {
        id: 'asc',
      };
      break;
  }

  try {
    const creatorsDetails = await db.user.findMany({
      where: {
        profile: {
          displayName: {
            contains: keyword,
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
            bio: true,
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
  } catch (error) {
    throw new Error('Error while getting creators');
  }
};

const getCreatorById = async (id: string) => {
  try {
    const creator = await db.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
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
        _count: {
          select: {
            followedBy: true,
          },
        },
      },
    });

    return creator;
  } catch (error) {
    if (error instanceof HttpException) {
      throw error;
    }
    throw new Error('Error while getting creator by id');
  }
};

export default {
  getCreators,
  getCreatorById,
};
