import { Router } from 'express';

import creatorController from '@/controllers/creatorController';

const router = Router();

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

export default router;
