import { Router } from 'express';

import categoryController from '@/controllers/categoryController';
import validateRequest from '@/middlewares/validateRequest';
import { categoryRequestSchema } from '@/validateSchema/categoryRequest';
import authenticate from '@/middlewares/authenticate';

const router = Router();

router.get(
  '/',
  /*
    #swagger.tags = ['Category']
    #swagger.description = 'Get all categories.'
    #swagger.responses[200] = {
      description: 'Categories',
      schema: {
        "statusCode": 0,
        "message": "Getting Categories successfully",
        "data": [
            {
                "id": "66700fdd82ebeef8be8f9323",
                "name": "Japan",
                "path": "/japan",
                "description": "日本",
                "createdAt": "2024-06-16T10:28:45.135Z",
                "updatedAt": "2024-06-17T18:28:45.135Z"
            }
          ]
      }
    }
    #swagger.responses[500] = {
      description: 'Internal server error',
      schema: { statusCode: 9999, message: 'Error while getting Categories' }
    }

  */
  categoryController.getCategory
);
router.post(
  '/',
  /* 
  #swagger.security = [{'Bearer': []}]
  #swagger.tags = ['Category']
  #swagger.description = 'Add a new category.'
  #swagger.parameters['payload'] = {
    in: 'body',
    description: 'Category details',
    required: true,
    schema: {
      name: '日本',
      path: '/japan',
      description: 'Travel in Japan'
    }
  }
  #swagger.responses[201] = {
    description: 'Category added successfully',
    schema: { httpCode: 201, message: 'Category added successfully' }
  }
  #swagger.responses[400] = {
    description: 'Invalid field (body)',
    schema: { httpCode: 400, message: 'Invalid field (body)', errorCode: 1003 }
  }
  #swagger.responses[401] = {
    description: 'Permission denied',
    schema: { httpCode: 401, message: 'Permission denied', errorCode: 2003 }
  }
  #swagger.responses[500] = {
    description: 'Internal server error',
    schema: { httpCode: 500, message: 'Error while adding category' }
  }
*/
  authenticate,
  validateRequest(categoryRequestSchema, 'body'),
  categoryController.addCategory
);

export default router;
