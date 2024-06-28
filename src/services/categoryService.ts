import db from '@/db';
import { Prisma } from '@prisma/client';

import { PrismaClientErrorCode } from '@/types/PrismaClientErrorCode';

type Category = {
  name: string;
  path: string;
  description: string;
};

const getCategoryByName = async (name: string) => {
  try {
    const result = await db.category.findFirst({ where: { name } });

    return result;
  } catch (error) {
    throw new Error('Error while checking category existence');
  }
};

const createCategory = async (payload: Category) => {
  try {
    const result = await db.category.create({
      data: payload,
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
    const result = await db.category.findMany();

    return result;
  } catch (error) {
    throw new Error('Error while getting categories');
  }
};

const updateCategory = async (categoryId: string, payload: Category) => {
  try {
    const result = await db.category.update({
      where: {
        id: categoryId,
      },
      data: payload,
    });

    return result;
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === PrismaClientErrorCode.OperationFailedError
    ) {
      return false;
    }

    throw new Error('Error while updating category');
  }
};

const deleteCategory = async (categoryId: string) => {
  try {
    const result = await db.category.delete({
      where: {
        id: categoryId,
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

    // if article is still connected to category, PrismaClientErrorCode.RelationViolationError will be thrown

    throw new Error('Error while deleting category');
  }
};

export default {
  createCategory,
  getCategoryByName,
  getCategories,
  updateCategory,
  deleteCategory,
};
