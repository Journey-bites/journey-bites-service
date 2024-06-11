import db from '@/db';

const getCreators = async (page = 1, pageSize = 10) => {
  const creatorsDetails = await db.user.findMany({
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
