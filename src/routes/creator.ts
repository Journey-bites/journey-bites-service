import { Router } from 'express';
import { z } from 'zod';

import creatorController from '@/controllers/creatorController';
import validateRequest from '@/middlewares/validateRequest';
import { optionalTokenAuthentication } from '@/middlewares/authenticate';
import { paginationSchema } from '@/validateSchema/pagination';

const router = Router();

const getCreatorsQuerySchema = paginationSchema.extend({
  type: z.enum(['hot', 'random']).or(z.string()).optional(),
  search: z.string().optional(),
});

router.get(
  '/',
  /* 
    #swagger.tags = ['Creator']
    #swagger.description = 'Get creators.'
    #swagger.parameters['page'] = {
      in: 'query',
      description: 'Page number',
      required: false,
      type: 'number'
    }
    #swagger.parameters['pageSize'] = {
      in: 'query',
      description: 'Number of items per page',
      required: false,
      type: 'number'
    }
    #swagger.parameters['search'] = {
      in: 'query',
      description: 'Search creator by name',
      required: false,
      type: 'string'
    }
    #swagger.parameters['type'] = {
      in: 'query',
      description: 'Type of creators',
      required: false,
      type: 'string',
      enum: ['hot', 'random']
    }
    #swagger.responses[200] = {
      description: 'Creators',
      schema: {
        statusCode: 0,
        message: 'success',
        data: [
          {
            userId: '1',
            email: 'journey-bites@gmail.com',
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
          },
        ]
      }
    }
    #swagger.responses[500] = {
      description: 'Internal server error',
      schema: { statusCode: 9999, message: 'Error while getting creators' }
    }
  */
  validateRequest(getCreatorsQuerySchema, 'query'),
  creatorController.getCreators
);

router.get(
  '/:creatorId',
  /* 
    #swagger.tags = ['Creator']
    #swagger.description = 'Get creator profile information.'
    #swagger.responses[200] = {
      description: 'Creator profile information',
      schema: {
        statusCode: 0,
        message: 'success',
        data: {
          id: "12312312",
          email: "journey-bites@gmail.com",
          displayName: "Journey Bites",
          avatarImageUrl: "https://journey-bites.com/avatar.jpg",
          bio: "Journey Bites is a travel blogger",
          socialLinks: {
            website: 'https://journey-bites2.com',
            instagram: 'https://instagram.com/journey-bites2',
            facebook: 'https://facebook.com/journey-bites2',
          },
          followersCount: 55
        }
      }
    }
    #swagger.responses[404] = {
      description: 'Creator doesn\'t exist',
      schema: { statusCode: 1001, message: 'Creator doesn\'t exist' }
    }
    #swagger.responses[500] = {
      description: 'Internal server error',
      schema: { statusCode: 9999, message: 'Error while getting creator info' }
    }
  */
  optionalTokenAuthentication,
  creatorController.getCreatorInfo
);

router.get(
  '/:creatorId/followers',
  /* 
    #swagger.tags = ['Creator']
    #swagger.description = 'Get user followers.'
    #swagger.responses[200] = {
      description: 'User followers',
      schema: {
        statusCode: 0,
        message: 'success',
        data: [
          {
            userId: '1',
            email: 'journey-bites@gmail.com',
            displayName: 'Journey Bites',
            avatarImageUrl: 'https://journey-bites.com/avatar.jpg',
            socialLinks: {
              website: 'https://journey-bites.com',
              instagram: 'https://instagram.com/journey-bites',
              facebook: 'https://facebook.com/journey-bites',
            },
            bio: 'Journey Bites is a travel blogger',
            isMutualFollow: true
          },
          {
            userId: '2',
            email: 'journey-bites2@gmail.com',
            displayName: 'Journey Bites 2',
            avatarImageUrl: 'https://journey-bites2.com/avatar.jpg',
            socialLinks: {
              website: 'https://journey-bites2.com',
              instagram: 'https://instagram.com/journey-bites2',
              facebook: 'https://facebook.com/journey-bites2',
            },
            bio: 'Journey Bites 2 is a travel blogger',
            isMutualFollow: false
          }
        ]
      }
    }
    #swagger.responses[500] = {
      description: 'Internal server error',
      schema: { statusCode: 9999, message: 'Error while getting user followers' }
    }
  */
  creatorController.getCreatorFollowers
);

router.get(
  '/:creatorId/followings',
  /* 
    #swagger.tags = ['Creator']
    #swagger.description = 'Get user followings.'
    #swagger.responses[200] = {
      description: 'User followings',
      schema: {
        statusCode: 0,
        message: 'success',
        data: [
          {
            userId: '1',
            email: 'journey-bites@gmail.com',
            displayName: 'Journey Bites',
            avatarImageUrl: 'https://journey-bites.com/avatar.jpg',
            socialLinks: {
              website: 'https://journey-bites.com',
              instagram: 'https://instagram.com/journey-bites',
              facebook: 'https://facebook.com/journey-bites',
            },
            bio: 'Journey Bites is a travel blogger',
            isMutualFollow: true
          },
          {
            userId: '2',
            email: 'journey-bites2@gmail.com',
            displayName: 'Journey Bites 2',
            avatarImageUrl: 'https://journey-bites2.com/avatar.jpg',
            socialLinks: {
              website: 'https://journey-bites2.com',
              instagram: 'https://instagram.com/journey-bites2',
              facebook: 'https://facebook.com/journey-bites2',
            },
            bio: 'Journey Bites 2 is a travel blogger',
            isMutualFollow: true
          }
        ]
      }
    }
    #swagger.responses[500] = {
      description: 'Internal server error',
      schema: { statusCode: 9999, message: 'Error while getting user followings' }
    }
  */
  creatorController.getCreatorFollowings
);

router.get(
  '/:creatorId/articles',
  /* 
    #swagger.tags = ['Creator']
    #swagger.description = 'Get creator articles.'
    #swagger.parameters['pageSize'] = {
      in: 'query',
      description: 'Number of items per page',
      required: false,
      type: 'number'
    }
    #swagger.responses[200] = {
      description: 'Creator articles',
      schema: {
        statusCode: 0,
        message: 'success',
        data: [
          {
            id: '6671ac7cac8af0d4f5eaf2be',
            title: '冰島旅遊適合你嗎？──兩次造訪冰島後我學到的事',
            abstract: '像《白日夢冒險王》的班史提勒在遼闊公路上追夢？在極光、瀑布、懸崖前露出觀光客的滿足微笑？這些你對冰島旅遊的美好想像，可能都會在親訪後大失所望…',
            content: '<p>123</p><p></p>',
            isNeedPay: false,
            readTime: 1,
            thumbnailUrl: 'https://www.example.com',
            category: "歐洲",
            tags: ['冰島', '旅遊'],
            createdAt: "2024-06-22T15:27:41.815Z",
            updatedAt: "2024-06-22T15:27:41.815Z",
            status: {
              views: 0,
              likes: 0,
              subscriptions: 0
            }
          },
        ]
      }
    }
    #swagger.responses[500] = {
      description: 'Internal server error',
      schema: { statusCode: 9999, message: 'Error while getting creator articles' }
    }
  */
  creatorController.getCreatorArticles
);

export default router;
