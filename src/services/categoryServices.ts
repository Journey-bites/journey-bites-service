import db from '@/db';
import { Prisma } from '@prisma/client';

const getCategoryByName = async (name: string) => {
  try {
    const result = await db.category.findFirst({ where: { name } });

    return result;
  } catch (error) {
    throw new Error('Error while checking category existence');
  }
};

const createCategory = async (name: string, path: string, description: string = '') => {
  try {
    const result = await db.category.create({
      data: {
        name,
        path,
        description,
      },
    });

    return result;
  } catch (error) {
    // Category_name_key is a unique constraint in the database
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      return false;
    }

    throw new Error('Error while adding category');
  }
};

const getCategories = async () => {
  try {
    const result = await db.category.findMany({
      omit: {
        createdAt: true,
        updatedAt: true,
      },
    });

    return result;
  } catch (error) {
    throw new Error('Error while getting categories');
  }
};

export default {
  createCategory,
  getCategoryByName,
  getCategories,
};
