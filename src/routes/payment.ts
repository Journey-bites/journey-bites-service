import { Router } from 'express';

import orderController from '@/controllers/orderController';

const router = Router();

router.post(
  '/newebpay/notify',
  /*  #swagger.tags = ['payment']
      #swagger.description = 'Newebpay notify' 
  */
  orderController.newebpayNotify
);
router.post(
  '/newebpay/return',
  /*  #swagger.tags = ['payment']
      #swagger.description = 'Newebpay return' 
  */
  orderController.newebpayReturn
);

export default router;
