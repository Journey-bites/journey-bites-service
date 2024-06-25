import { Router } from 'express';

import commentController from '@/controllers/commentController';
import authenticate from '@/middlewares/authenticate';
import validateRequest from '@/middlewares/validateRequest';
import { commentRequestBodySchema } from '@/validateSchema/commentRequest';
import validateParamsObjectIds from '@/middlewares/validateParamsObjectIds';

const router = Router();

router.patch(
  '/:commentId',
  /*
    #swagger.tags = ['Comment']
    #swagger.description = 'Update a comment.'
    #swagger.parameters['commentId'] = { description: 'Comment ID' }
    #swagger.parameters['payload'] = {
      in: 'body',
      description: 'Comment details',
      required: true,
      schema: {
        content: 'This is a new comment'
      }
    }
    #swagger.responses[200] = {
      description: 'Comment updated successfully',
      schema: { httpCode: 200, message: 'Comment updated successfully' }
    }
    #swagger.responses[400] = {
      description: 'Invalid field (body)',
      schema: { httpCode: 400, message: 'Invalid field (body)', errorCode: 1003 }
    }
    #swagger.responses[401] = {
      description: 'Permission denied',
      schema: { httpCode: 401, message: 'Permission denied', errorCode: 2003 }
    }
    #swagger.responses[404] = {
      description: 'Comment not found',
      schema: { httpCode: 404, message: 'Comment not found', errorCode: 2004 }
    }
    #swagger.responses[500] = {
      description: 'Internal server error',
      schema: { httpCode: 500, message: 'Error while updating comment' }
    }
  */
  authenticate,
  validateParamsObjectIds(['commentId']),
  validateRequest(commentRequestBodySchema, 'body'),
  commentController.updateComment
);

router.delete(
  '/:commentId',
  /*
    #swagger.tags = ['Comment']
    #swagger.description = 'Delete a comment.'
    #swagger.parameters['commentId'] = { description: 'Comment ID' }
    #swagger.responses[204] = {
      description: 'Comment deleted successfully'
    }
    #swagger.responses[401] = {
      description: 'Permission denied',
      schema: { httpCode: 401, message: 'Permission denied', errorCode: 2003 }
    }
    #swagger.responses[404] = {
      description: 'Comment not found',
      schema: { httpCode: 404, message: 'Comment not found', errorCode: 2004 }
    }
    #swagger.responses[500] = {
      description: 'Internal server error',
      schema: { httpCode: 500, message: 'Error while deleting comment' }
    }
  */
  authenticate,
  validateParamsObjectIds(['commentId']),
  commentController.deleteComment
);

export default router;
