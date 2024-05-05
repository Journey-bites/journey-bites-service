import db from '@/db';

const findUserById = async (id: string) => {
  return db.user.findFirst({ where: { id } });
};

const findUserByEmail = async (email: string) => {
  return db.user.findFirst({ where: { email } });
};

const createUser = async (email: string, hashedPassword: string) => {
  try {
    const user = await db.user.create({
      data: {
        email,
        password: hashedPassword,
      },
    });

    return user;
  } catch (error) {
    throw new Error('Error while creating a new user');
  }
};

export default {
  findUserById,
  findUserByEmail,
  createUser,
};
