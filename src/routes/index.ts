import { Router } from 'express';
import swaggerUi from 'swagger-ui-express';

import authenticate from '@/middlewares/authenticate';
import authRouter from '@/routes/auth';
import hotArticleRouter from '@/routes/articleHot';
import creatorRouter from '@/routes/creator';
import userRouter from '@/routes/user';
import swaggerDocument from '@/swagger-output.json';
import { createResponse } from '@/utils/http';

const router = Router();

router.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
router.get(
  '/',
  /*  #swagger.tags = ['default']
        #swagger.description = 'Demo' */
  /*  #swagger.responses[200] = {
        description: 'Hello World',
        schema: 
          {
            "errorCode": 0,
            "message": "Hello World!",
            "data": null
          }
        } 
      #swagger.responses[500] = {
        description: 'Internal Server Error'
      }
  */
  (_, res) => createResponse(res, { message: 'Hello World!' })
);
router.use('/auth', authRouter);
router.use('/hot-articles', hotArticleRouter);
router.use('/creator', creatorRouter);

router.use('/user', authenticate, userRouter);

export default router;
