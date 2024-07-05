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
          orderNo: '1',
          status: 'pending',
          ticket: {
            ticketNo: '1',
            title: 'Ticket 1',
            price: 100,
            quantity: 2,
            total: 200
          },
          user: {
            userId: '1',
            email: 'test1@gmail.com',
            displayName: 'Journey Bites',
            avatarImageUrl: 'https://journey-bites.com/avatar.jpg',
            bio: 'Journey Bites is a travel blogger',
            socialLinks: {
              website: 'https://journey-bites.com',
              instagram: 'https://instagram.com/journey-bites',
              facebook: 'https://facebook.com/journey-bites',
            },
            followers: [
              {
                followerId: 2
              }
            ],
            followings: [
              {
                followingId: 1
              }
            ]
          }
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
