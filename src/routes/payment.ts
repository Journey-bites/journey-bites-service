import { Router } from 'express';

import orderController from '@/controllers/orderController';

const router = Router();

router.post('/newebpay/notify', orderController.newebpayNotify);
router.post('/newebpay/return', orderController.newebpayReturn);

export default router;
