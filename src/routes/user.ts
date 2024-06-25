import { Router } from 'express';

import userController from '@/controllers/userController';
import validateParamsObjectIds from '@/middlewares/validateParamsObjectIds';
import validateRequest from '@/middlewares/validateRequest';
import { updateUserRequestSchema } from '@/validateSchema/updateUserRequest';

const router = Router();

router.get(
  '/',
  /* 
    #swagger.security = [{'Bearer': []}]
    #swagger.tags = ['User']
    #swagger.description = 'Get user profile information.'
    #swagger.responses[200] = {
      description: 'User profile information',
      schema: {
        statusCode: 0,
        message: 'success',
        data: {
          email: "journey-bites@gmail.com",
          emailVerified: true,
          profile: {
            displayName: "Journey",
            avatarImageUrl: "https://journey-bites.com/avatar.jpg",
            bio: "Travel blogger",
            socialLinks: {
              website: "https://journey-bites.com",
              instagram: "https://instagram.com/journey-bites",
              facebook: "https://facebook.com/journey-bites"
            }
          },
          billing: {
            bankCode: null,
            bankAccount: null,
            bankAccountOwner: null
          }
        }
      }
    }
    #swagger.responses[401] = {
      description: 'Unauthorized',
      schema: { statusCode: 2003, message: 'Permission denied' }
    }
    #swagger.responses[404] = {
      description: 'User not found',
      schema: { statusCode: 2001, message: 'User not found' }
    }
    #swagger.responses[500] = {
      description: 'Internal server error',
      schema: { statusCode: 9999, message: 'Error while getting user info' }
    }
  */
  userController.getUserInfo
);

router.patch(
  '/',
  /* 
    #swagger.security = [{'Bearer': []}]
    #swagger.tags = ['User']
    #swagger.description = 'Update user profile information.'
    #swagger.parameters['payload'] = {
      in: 'body',
      description: 'User profile',
      required: true,
      schema: {
        displayName: 'Journey Bites',
        avatarImageUrl: 'https://journey-bites.com/avatar.jpg',
        bio: 'Travel blogger',
        socialLinks: {
          website: 'https://journey-bites.com',
          instagram: 'https://instagram.com/journey-bites',
          facebook: 'https://facebook.com/journey-bites',
        }
      }
    }
    #swagger.responses[201] = {
      description: 'User profile updated successfully',
      schema: { statusCode: 0, message: 'User profile updated successfully' }
    }
    #swagger.responses[400] = {
      description: 'Invalid field',
      schema: { statusCode: 1003, message: 'Invalid field (body)' }
    }
    #swagger.responses[401] = {
      description: 'Unauthorized',
      schema: { statusCode: 2003, message: 'Permission denied' }
    }
    #swagger.responses[500] = {
      description: 'Internal server error',
      schema: { statusCode: 9999, message: 'Error while updating user profile' }
    }
  */
  validateRequest(updateUserRequestSchema, 'body'),
  userController.updateUserProfile
);

router.get(
  '/followers',
  /* 
    #swagger.security = [{'Bearer': []}]
    #swagger.tags = ['User']
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
            bio: 'Journey Bites is a travel blogger',
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
            bio: 'Journey Bites 2 is a travel blogger',
            isMutualFollow: false
          }
        ]
      }
    }
    #swagger.responses[401] = {
      description: 'Unauthorized',
      schema: { statusCode: 2003, message: 'Permission denied' }
    }
    #swagger.responses[500] = {
      description: 'Internal server error',
      schema: { statusCode: 9999, message: 'Error while getting user followers' }
    }
  */
  userController.getUserFollowers
);

router.get(
  '/followings',
  /* 
    #swagger.security = [{'Bearer': []}]
    #swagger.tags = ['User']
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
            bio: 'Journey Bites is a travel blogger',
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
            bio: 'Journey Bites 2 is a travel blogger',
            isMutualFollow: false
          }
        ]
      }
    }
    #swagger.responses[401] = {
      description: 'Unauthorized',
      schema: { statusCode: 2003, message: 'Permission denied' }
    }
    #swagger.responses[500] = {
      description: 'Internal server error',
      schema: { statusCode: 9999, message: 'Error while getting user followings' }
    }
  */
  userController.getUserFollowings
);

router.post(
  '/:userId/follow',
  /* 
    #swagger.security = [{'Bearer': []}]
    #swagger.tags = ['User']
    #swagger.description = 'Follow a user.'
    #swagger.responses[201] = {
      description: 'User followed successfully',
      schema: { statusCode: 0, message: 'User followed successfully' }
    }
    #swagger.responses[400] = {
      description: 'Invalid field',
      schema: { statusCode: 1005, message: 'You cannot follow yourself' }
    }
    #swagger.responses[401] = {
      description: 'Unauthorized',
      schema: { statusCode: 2003, message: 'Permission denied' }
    }
    #swagger.responses[404] = {
      description: 'User not found',
      schema: { statusCode: 2001, message: 'User not found' }
    }
    #swagger.responses[500] = {
      description: 'Internal server error',
      schema: { statusCode: 9999, message: 'Error while following user' }
    }
  */
  validateParamsObjectIds(['userId']),
  userController.followUser
);

router.delete(
  '/:userId/follow',
  /* 
    #swagger.security = [{'Bearer': []}]
    #swagger.tags = ['User']
    #swagger.description = 'Unfollow a user.'
    #swagger.responses[200] = {
      description: 'User unfollowed successfully',
      schema: { statusCode: 0, message: 'User unfollowed successfully' }
    }
    #swagger.responses[400] = {
      description: 'Invalid field',
      schema: { statusCode: 1005, message: 'You cannot unfollow yourself' }
    }
    #swagger.responses[401] = {
      description: 'Unauthorized',
      schema: { statusCode: 2003, message: 'Permission denied' }
    }
    #swagger.responses[404] = {
      description: 'User not found',
      schema: { statusCode: 2001, message: 'User not found' }
    }
    #swagger.responses[500] = {
      description: 'Internal server error',
      schema: { statusCode: 9999, message: 'Error while unfollowing user' }
    }
  */
  validateParamsObjectIds(['userId']),
  userController.unfollowUser
);

router.get(
  '/articles',
  /* 
    #swagger.security = [{'Bearer': []}]
    #swagger.tags = ['User']
    #swagger.description = 'Get user articles.'
    #swagger.responses[200] = {
      description: 'User articles',
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
    #swagger.responses[401] = {
      description: 'Unauthorized',
      schema: { statusCode: 2003, message: 'Permission denied' }
    }
    #swagger.responses[500] = {
      description: 'Internal server error',
      schema: { statusCode: 9999, message: 'Error while getting user articles' }
    }
  */
  userController.getUserArticles
);

export default router;
