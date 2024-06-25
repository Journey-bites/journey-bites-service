import { Request, Response, NextFunction } from 'express';

import { HttpException } from '@/exceptions/HttpException';
import { ResourceNotFoundException } from '@/exceptions/ResourceNotFoundException';
import { SystemException } from '@/exceptions/SystemException';
import commentServices from '@/services/commentServices';
import asyncHandler from '@/utils/asyncHandler';
import { createResponse } from '@/utils/http';
import { CommentRequestBody } from '@/validateSchema/commentRequest';

interface CommentRequest extends Request {
  params: {
    commentId: string;
  };
  body: CommentRequestBody;
}

const commentController = {
  updateComment: asyncHandler(async (req: CommentRequest, res: Response, next: NextFunction) => {
    const userId = req.user.id;
    const { commentId } = req.params;
    const { content } = req.body;

    try {
      const result = await commentServices.updateComment(userId, commentId, content);

      if (!result) {
        throw new ResourceNotFoundException('Comment not found');
      }

      createResponse(res, { message: 'Comment updated successfully' });
    } catch (error) {
      if (error instanceof HttpException) {
        next(error);
        return;
      }

      throw new SystemException('Error while updating comment');
    }
  }),
  deleteComment: asyncHandler(async (req: CommentRequest, res: Response, next: NextFunction) => {
    const userId = req.user.id;
    const { commentId } = req.params;

    try {
      const result = await commentServices.deleteComment(userId, commentId);

      if (!result) {
        throw new ResourceNotFoundException('Comment not found');
      }

      createResponse(res, { httpCode: 204 });
    } catch (error) {
      if (error instanceof HttpException) {
        next(error);
        return;
      }

      throw new SystemException('Error while deleting comment');
    }
  }),
};

export default commentController;
