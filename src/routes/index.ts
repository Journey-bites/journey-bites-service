import { Router } from 'express';
import swaggerUi from 'swagger-ui-express';

import swaggerDocument from '@/swagger-output.json';

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
            "statusCode": 0,
            "message": "Hello World!",
            "data": null
          }
        } 
      #swagger.responses[500] = {
        description: 'Internal Server Error'
      }
  */
  (_, res) => {
    res.json({
      statusCode: 0,
      message: 'Hello World!',
      data: null,
    });
  }
);

export default router;
