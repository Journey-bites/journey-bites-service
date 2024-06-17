import { Router } from 'express';

import categoryController from '@/controllers/categoryController';
import validateRequest from '@/middlewares/validateRequest';
import { categoryRequestSchema } from '@/validateSchema/categoryRequest';
import authenticate from '@/middlewares/authenticate';

const router = Router();

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
router.get(
  '/',
  /*
    #swagger.tags = ['Category']
    #swagger.description = 'Get category.'
    #swagger.responses[200] = {
      description: 'Creators',
      schema: {
        "statusCode": 0,
        "message": "Categories fetched successfully",
        "data": [
            {
                "id": "66700fdd82ebeef8be8f9323",
                "name": "Japan",
                "path": "/category/Japan",
                "description": "日本",
                "createdAt": "2024-06-16T10:28:45.135Z",
                "updatedAt": "2024-06-17T18:28:45.135Z"
            },
            {
                "id": "66700fe482ebeef8be8f9324",
                "name": "America",
                "path": "/category/America",
                "description": "美國",
                "createdAt": "2024-06-16T10:28:52.076Z",
                "updatedAt": "2024-06-17T20:28:52.076Z"
            },
            {
                "id": "66700fea82ebeef8be8f9325",
                "name": "Korea",
                "path": "/category/Korea",
                "description": "韓國",
                "createdAt": "2024-06-16T10:28:58.791Z",
                "updatedAt": "2024-06-17T21:28:58.791Z"
            }
          ]
      }
    }
    #swagger.responses[500] = {
      description: 'Internal server error',
      schema: { statusCode: 9999, message: 'Error while getting creators' }
    }

  */
  categoryController.getCategory
);

export default router;
