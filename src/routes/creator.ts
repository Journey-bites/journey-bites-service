import { Router } from 'express';
import { z } from 'zod';

import creatorController from '@/controllers/creatorController';
import validateRequest from '@/middlewares/validateRequest';
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
            userId: 1,
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
            userId: 1,
            email: 'journey-bites@gmail.com',
            displayName: 'Journey Bites',
            avatarImageUrl: 'https://journey-bites.com/avatar.jpg',
            socialLinks: {
              website: 'https://journey-bites.com',
              instagram: 'https://instagram.com/journey-bites',
              facebook: 'https://facebook.com/journey-bites',
            },
            isMutualFollow: true
          },
          {
            userId: 2,
            email: 'journey-bites2@gmail.com',
            displayName: 'Journey Bites 2',
            avatarImageUrl: 'https://journey-bites2.com/avatar.jpg',
            socialLinks: {
              website: 'https://journey-bites2.com',
              instagram: 'https://instagram.com/journey-bites2',
              facebook: 'https://facebook.com/journey-bites2',
            },
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
            userId: 1,
            email: 'journey-bites@gmail.com',
            displayName: 'Journey Bites',
            avatarImageUrl: 'https://journey-bites.com/avatar.jpg',
            socialLinks: {
              website: 'https://journey-bites.com',
              instagram: 'https://instagram.com/journey-bites',
              facebook: 'https://facebook.com/journey-bites',
            },
            isMutualFollow: true
          },
          {
            userId: 2,
            email: 'journey-bites2@gmail.com',
            displayName: 'Journey Bites 2',
            avatarImageUrl: 'https://journey-bites2.com/avatar.jpg',
            socialLinks: {
              website: 'https://journey-bites2.com',
              instagram: 'https://instagram.com/journey-bites2',
              facebook: 'https://facebook.com/journey-bites2',
            },
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
  creatorController.getCreatorInfo
);

export default router;
