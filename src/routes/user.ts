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
          id: "667b20205e32661530d68501",
          email: "journey-bites@gmail.com",
          isEmailVerified: true,
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
            bankCode: "",
            bankAccount: "",
            bankAccountOwner: ""
          },
          subscriptions: ["667b20205e32661530d68501"],
          subscribers: ["667b20205e32661530d68501"]
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
    #swagger.responses[400] = {
      description: 'Invalid field',
      schema: { statusCode: 1006, message: 'Invalid field (param)' }
    }
    #swagger.responses[400] = {
      description: 'Invalid field',
      schema: { statusCode: 3001, message: 'You have already followed this user' }
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
    #swagger.responses[400] = {
      description: 'Invalid field',
      schema: { statusCode: 1006, message: 'Invalid field (param)' }
    }
    #swagger.responses[400] = {
      description: 'Invalid field',
      schema: { statusCode: 1006, message: 'You have not followed this user' }
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
            },
            commentCount: 8
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

router.post(
  '/:userId/subscribe',
  /* 
    #swagger.security = [{'Bearer': []}]
    #swagger.tags = ['User']
    #swagger.description = 'Subscribe to a user.'
    #swagger.responses[201] = {
      description: 'Create order successfully',
      schema: { 
        statusCode: 0, 
        message: 'User subscribed successfully',
        data: {
          MerchantID: 'MSxxxxxxxxx',
          TradeInfo: 'bc24c3030cdc2c5fecb725acca25fc1a964744a397d5cefb5340a754e9e88c222931bdd44ee1edafa2b7633307c348d397e5c8374c35b986ca332bebfc00a8cccc1668a415c8e91c43480813b3d0e55c357117cf913aa709587b905e0d10189bacb2ef89a8cf7059d4c4d27234653c78a7503d7e86c29047ca745318f27c2998d4f69f852f0c23d4416454253b7ed1bcabf9314462c807066b4bf1ae6360b1e53efe59a7c0fc442c0a0ed96f7db26472',
          TradeSha: '3AEF71536B5B9DCD5A5A40F5732750A1D80163B3DD8E0523EC7B708FAAC31110',
          Version: '2.0'
        }
      }
    }
    #swagger.responses[400] = {
      description: 'Invalid field',
      schema: { statusCode: 1005, message: 'You cannot subscribe yourself' }
    }
    #swagger.responses[400] = {
      description: 'Invalid field',
      schema: { statusCode: 1006, message: 'Invalid field (param)' }
    }
    #swagger.responses[400] = {
      description: 'Invalid field',
      schema: { statusCode: 3002, message: 'You have already subscribed this use' }
    }
    #swagger.responses[401] = {
      description: 'Unauthorized',
      schema: { statusCode: 2003, message: 'Permission denied' }
    }
    #swagger.responses[404] = {
      description: 'Target user not found',
      schema: { statusCode: 2001, message: 'Subscription user not found' }
    }
    #swagger.responses[500] = {
      description: 'Internal server error',
      schema: { statusCode: 9999, message: 'Error while create order for subscription' }
    }
  */
  validateParamsObjectIds(['userId']),
  userController.subscribeUser
);

export default router;
