import { OAuthProvider } from '@prisma/client';
import db from '@/db';
import { UserProfile } from '@/types/comm';

const findUserById = async (id: string, isIncludePassword = false) => {
  const user = await db.user.findUnique({
    where: { id },
    include: {
      profile: {
        select: {
          displayName: true,
          avatarImageUrl: true,
          bio: true,
          socialLinks: true,
        },
      },
      oAuthProvider: true,
      billing: true,
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
      profile: {
        select: {
          displayName: true,
          avatarImageUrl: true,
          bio: true,
          socialLinks: true,
        },
      },
      oAuthProvider: true,
      billing: true,
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

export default {
  findUserById,
  findUserByEmail,
  createUser,
  updateUserPassword,
  updateUserProfile,
  updateUserOauthProvider,
};
