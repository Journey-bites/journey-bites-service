import db from '@/db';
import { Prisma } from '@prisma/client';

import { PrismaClientErrorCode } from '@/types/PrismaClientErrorCode';

const updateComment = async (userId: string, commentId: string, content: string) => {
  try {
    const result = await db.comment.update({
      where: {
        id: commentId,
        userId,
      },
      data: {
        content,
      },
    });

    return !!result;
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === PrismaClientErrorCode.OperationFailedError
    ) {
      return false;
    }

    throw new Error('Error while updating comment');
  }
};

const deleteComment = async (userId: string, commentId: string) => {
  try {
    const result = await db.comment.delete({
      where: {
        id: commentId,
        userId,
      },
    });

    return !!result;
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === PrismaClientErrorCode.OperationFailedError
    ) {
      return false;
    }

    throw new Error('Error while deleting comment');
  }
};

export default {
  updateComment,
  deleteComment,
};
