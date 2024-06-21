import { Router } from 'express';

import categoryController from '@/controllers/categoryController';
import validateRequest from '@/middlewares/validateRequest';
import { categoryRequestSchema } from '@/validateSchema/categoryRequest';
import authenticate from '@/middlewares/authenticate';

const router = Router();

router.post('/', authenticate, validateRequest(categoryRequestSchema, 'body'), categoryController.addCategory);
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
            },
            {
                "id": "66700fe482ebeef8be8f9324",
                "name": "America",
                "path": "/america",
                "description": "美國",
                "createdAt": "2024-06-16T10:28:52.076Z",
                "updatedAt": "2024-06-17T20:28:52.076Z"
            },
            {
                "id": "66700fea82ebeef8be8f9325",
                "name": "Korea",
                "path": "/korea",
                "description": "韓國",
                "createdAt": "2024-06-16T10:28:58.791Z",
                "updatedAt": "2024-06-17T21:28:58.791Z"
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

export default router;
