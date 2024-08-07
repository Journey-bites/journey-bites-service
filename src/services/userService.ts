import { Prisma, type OAuthProvider } from '@prisma/client';

import db from '@/db';
import { baseUserProfileQueryWithSocialLinks } from '@/db/queryCondition';
import { UserProfile } from '@/types/comm';
import { PrismaClientErrorCode } from '@/types/PrismaClientErrorCode';

const findUserById = async (id: string, isIncludePassword = false) => {
  const user = await db.user.findUnique({
    where: { id },
    include: {
      profile: baseUserProfileQueryWithSocialLinks,
      oAuthProvider: {
        select: {
          googleId: true,
          facebookId: true,
        },
      },
      billing: {
        select: {
          bankCode: true,
          bankAccount: true,
          bankAccountOwner: true,
        },
      },
      subscriptions: {
        select: {
          subscribedToId: true,
        },
      },
      subscribers: {
        select: {
          subscriberId: true,
        },
      },
      follows: {
        select: {
          followingId: true,
        },
      },
      likedArticles: {
        select: {
          articleId: true,
        },
      },
    },
    omit: {
      password: !isIncludePassword,
    },
  });

  return user;
};

const findUserByEmail = async (email: string, isIncludePassword = false) => {
  const user = await db.user.findUnique({
    where: { email },
    include: {
      profile: baseUserProfileQueryWithSocialLinks,
      oAuthProvider: {
        select: {
          googleId: true,
          facebookId: true,
        },
      },
      billing: {
        select: {
          bankCode: true,
          bankAccount: true,
          bankAccountOwner: true,
        },
      },
      subscriptions: {
        select: {
          subscribedToId: true,
        },
      },
      subscribers: {
        select: {
          subscriberId: true,
        },
      },
    },
    omit: {
      password: !isIncludePassword,
    },
  });

  return user;
};

const createUser = async (email: string, hashedPassword: string, userProfile: Partial<UserProfile>) => {
  const { socialLinks, ...profile } = userProfile;

  try {
    const user = await db.user.create({
      data: {
        email,
        password: hashedPassword,
        profile: {
          create: {
            ...profile,
            displayName: profile.displayName || email.split('@')[0],
            socialLinks: {
              create: {
                ...socialLinks,
              },
            },
          },
        },
        oAuthProvider: {
          create: {},
        },
        billing: {
          create: {},
        },
      },
    });

    return user;
  } catch (error) {
    throw new Error('Error while creating a new user');
  }
};

const updateUserPassword = async (id: string, hashedPassword: string) => {
  try {
    await db.user.update({
      where: { id },
      data: {
        password: hashedPassword,
      },
    });
  } catch (error) {
    throw new Error('Error while updating user password');
  }
};

const updateUserProfile = async (id: string, userProfile: UserProfile) => {
  const { socialLinks, ...profile } = userProfile;

  try {
    const user = await db.user.update({
      where: { id },
      data: {
        profile: {
          update: {
            ...profile,
            socialLinks: {
              update: {
                ...socialLinks,
              },
            },
          },
        },
      },
    });

    return user;
  } catch (error) {
    throw new Error('Error while updating user profile');
  }
};

const updateUserOauthProvider = async (id: string, provider: keyof Omit<OAuthProvider, 'id'>, providerId: string) => {
  try {
    await db.user.update({
      where: { id },
      data: {
        oAuthProvider: {
          update: {
            [provider]: providerId,
          },
        },
      },
    });
  } catch (error) {
    throw new Error('Error while updating user oauth provider');
  }
};

const getUserFollowers = async (userId: string) => {
  try {
    const followersDetails = await db.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        followedBy: {
          select: {
            follower: {
              select: {
                id: true,
                email: true,
                profile: baseUserProfileQueryWithSocialLinks,
                followedBy: {
                  select: {
                    followerId: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    const followers = followersDetails?.followedBy.map(({ follower }) => ({
      userId: follower.id,
      email: follower.email,
      ...follower.profile,
      isMutualFollow: follower.followedBy.some(({ followerId }) => followerId === userId),
    }));

    return followers;
  } catch (error) {
    throw new Error('Error while getting user followers');
  }
};

const getUserFollowings = async (userId: string) => {
  try {
    const followingsDetails = await db.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        follows: {
          select: {
            following: {
              select: {
                id: true,
                email: true,
                profile: baseUserProfileQueryWithSocialLinks,
                follows: {
                  select: {
                    followingId: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    const followings = followingsDetails?.follows.map(({ following }) => ({
      userId: following.id,
      email: following.email,
      ...following.profile,
      isMutualFollow: following.follows.some(({ followingId }) => followingId === userId),
    }));

    return followings;
  } catch (error) {
    throw new Error('Error while getting user followings');
  }
};

const followUser = async (followerUserId: string, followingUserId: string) => {
  try {
    const result = await db.follow.create({
      data: {
        followerId: followerUserId,
        followingId: followingUserId,
      },
    });

    return result;
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === PrismaClientErrorCode.UniqueConstraintError
    ) {
      return false;
    }
    throw new Error('Error while following user');
  }
};

const unfollowUser = async (followerUserId: string, followingUserId: string) => {
  try {
    const result = await db.follow.delete({
      where: {
        followerId_followingId: {
          followerId: followerUserId,
          followingId: followingUserId,
        },
      },
    });

    return result;
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === PrismaClientErrorCode.OperationFailedError
    ) {
      return false;
    }
    throw new Error('Error while unfollowing user');
  }
};

const checkIsUserSubscribed = async (userId: string, creatorId: string) => {
  const subscription = await db.subscription.findUnique({
    where: {
      subscribedToId_subscriberId: {
        subscriberId: userId,
        subscribedToId: creatorId,
      },
    },
  });

  return subscription;
};

export default {
  findUserById,
  findUserByEmail,
  createUser,
  updateUserPassword,
  updateUserProfile,
  updateUserOauthProvider,
  getUserFollowers,
  getUserFollowings,
  followUser,
  unfollowUser,
  checkIsUserSubscribed,
};
