import { Router } from 'express';
import swaggerUi from 'swagger-ui-express';

import authenticate from '@/middlewares/authenticate';
import authRouter from '@/routes/auth';
import hotArticleRouter from '@/routes/articleHot';
import creatorRouter from '@/routes/creator';
import articlesRouter from '@/routes/articles';
import articleRouter from '@/routes/article';
import commentRouter from '@/routes/comment';
import categoryRouter from '@/routes/category';
import paymentRouter from '@/routes/payment';
import userRouter from '@/routes/user';
import orderRouter from '@/routes/order';
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
router.use('/articles', articlesRouter);
router.use('/article', articleRouter);
router.use('/category', categoryRouter);
router.use('/comment', commentRouter);
router.use('/payment', paymentRouter);

router.use('/user', authenticate, userRouter);
router.use('/order', authenticate, orderRouter);

export default router;
