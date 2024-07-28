import { Router } from 'express';
import multer from 'multer';
import fileController from '@/controllers/fileController';
import validateRequest from '@/middlewares/validateRequest';
import { imageFileRequestSchema } from '@/validateSchema/fileRequest';

const router = Router();
const upload = multer();

router.post(
  '/upload-image',
  /* 
  #swagger.security = [{'Bearer': []}]
  #swagger.tags = ['File']
  #swagger.description = 'Upload image to R2.'
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
    schema: { statusCode: 9999, message: 'Error while uploading image to R2' }
  }
*/
  upload.single('image'),
  validateRequest(imageFileRequestSchema, 'file'),
  fileController.uploadImageToR2
);
export default router;
