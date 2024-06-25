import db from '@/db';
import { Prisma } from '@prisma/client';

import { PrismaClientErrorCode } from '@/types/pprismaClientErrorCode';

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
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === PrismaClientErrorCode.UniqueConstraintError
    ) {
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
