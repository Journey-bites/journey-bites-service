/* eslint-disable @typescript-eslint/no-explicit-any */
import db from '@/db';

type getCreatorsPayload = {
  page?: number;
  pageSize?: number;
  type?: 'common' | 'hot' | 'random';
  searchName?: string;
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

const getCreators = async ({ page = 1, pageSize = 10, type = 'common', searchName = '' }: getCreatorsPayload) => {
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
  } catch (error) {
    throw new Error('Error while getting creators');
  }
};

export default {
  getCreators,
};
