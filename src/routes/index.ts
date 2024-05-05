import { Router } from 'express';
import swaggerUi from 'swagger-ui-express';

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

export default router;
