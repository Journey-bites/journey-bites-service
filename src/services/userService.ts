import { Profile, SocialLinks } from '@prisma/client';

import db from '@/db';

const findUserById = async (id: string) => {
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
  });

  return user;
};

const findUserByEmail = async (email: string) => {
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
  });

  return user;
};

const createUser = async (email: string, hashedPassword: string, displayName: string) => {
  try {
    const user = await db.user.create({
      data: {
        email,
        password: hashedPassword,
        profile: {
          create: {
            displayName,
            socialLinks: {
              create: {},
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

const updateUserProfile = async (
  id: string,
  userProfile: Partial<Profile> & { socialLinks?: Partial<SocialLinks> }
) => {
  const { displayName, avatarImageUrl, bio, socialLinks } = userProfile;
  const { website, instagram, facebook } = socialLinks || {};

  try {
    await db.user.update({
      where: { id },
      data: {
        profile: {
          update: {
            displayName,
            avatarImageUrl,
            bio,
            socialLinks: {
              update: {
                website,
                instagram,
                facebook,
              },
            },
          },
        },
      },
    });
  } catch (error) {
    throw new Error('Error while updating user profile');
  }
};

export default {
  findUserById,
  findUserByEmail,
  createUser,
  updateUserPassword,
  updateUserProfile,
};
