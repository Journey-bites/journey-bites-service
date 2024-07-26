import { Router } from 'express';

import fileController from '@/controllers/fileController';
import validateRequest from '@/middlewares/validateRequest';
import { fileRequestSchema } from '@/validateSchema/fileRequest';

const router = Router();

router.post(
  '/upload-image',
  /* 
  #swagger.security = [{'Bearer': []}]
  #swagger.tags = ['File']
  #swagger.description = 'Get pre-signed URL.'
  #swagger.responses[201] = {
    description: 'success',
    schema: { 
      statusCode: 0, 
      message: 'success',
      data: {
        url: 'https://pub-261d5a36b3f7430b93fd5c3b8e30de53.r2.dev/044533fb-c0ea-4235-808a-8843206d7510'
      }
    }
  }
  #swagger.responses[500] = {
    description: 'Internal server error',
    schema: { statusCode: 9999, message: 'Error while getting pre-signed URL' }
  }
*/
  validateRequest(fileRequestSchema),
  fileController.uploadImageToR2
);
export default router;
