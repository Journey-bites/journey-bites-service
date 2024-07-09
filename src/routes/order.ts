import { Router } from 'express';

import orderController from '@/controllers/orderController';

const router = Router();

router.get(
  '/ticket/:orderNo',
  /*
    #swagger.security = [{'Bearer': []}]
    #swagger.tags = ['Order']
    #swagger.description = 'Get order by order number.'
    #swagger.parameters['orderNo'] = {
      in: 'path',
      description: 'Order number',
      required: true,
      type: 'string'
    }
    #swagger.responses[200] = {
      description: 'Order',
      schema: {
        statusCode: 0,
        message: 'success',
        data: {
          orderNo: '20240705_mb2d4d',
          payment: {
              amount: 60,
              transactionId: '24070516431407295',
              paymentIP: '123.194.159.15',
              escrowBank: 'HNCB',
              paymentType: 'WEBATM',
              account5Code: '12345',
              payBankCode: '809',
              orderId: '6687b2199dff4ff495c7606d',
              createdAt: '2024-07-05T08:43:15.456Z'
          },
          seller: {
            id: '667b20205e32661530d68501',
            profile: {
              displayName: 'Journey Bites',
              avatarImageUrl: 'https://journey-bites.com/avatar.jpg',
              bio: 'Travel blogger',
            }
          },
          isSuccess: true,
        }
      }
    }
    #swagger.responses[401] = {
      description: 'Unauthorized',
      schema: { statusCode: 1002, message: 'Unauthorized' }
    }
    #swagger.responses[404] = {
      description: 'Order not found',
      schema: { statusCode: 1007, message: 'Order not found' }
    }
    #swagger.responses[500] = {
      description: 'Internal server error',
      schema: { statusCode: 9999, message: 'Error while getting order' }
    }
  */
  orderController.getOrder
);

export default router;
