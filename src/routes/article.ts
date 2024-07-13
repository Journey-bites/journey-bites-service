import { Router } from 'express';

import articleController from '@/controllers/articleController';
import authenticate, { authenticateOptional } from '@/middlewares/authenticate';
import validateRequest from '@/middlewares/validateRequest';
import validateParamsObjectIds from '@/middlewares/validateParamsObjectIds';
import { createArticleBodySchema } from '@/validateSchema/createArticleRequest';
import { commentRequestBodySchema } from '@/validateSchema/commentRequest';

const router = Router();

router.post(
  '/',
  /*
    #swagger.security = [{'Bearer': []}]
    #swagger.tags = ['Article']
    #swagger.description = 'Create an article.'
    #swagger.parameters['payload'] = {
      in: 'body',
      description: 'Article data to create.',
      required: true,
      schema: {
        title: '冰島旅遊適合你嗎？──兩次造訪冰島後我學到的事',
        abstract: '像《白日夢冒險王》的班史提勒在遼闊公路上追夢？在極光、瀑布、懸崖前露出觀光客的滿足微笑？這些你對冰島旅遊的美好想像，可能都會在親訪後大失所望…',
        content: '<p>123</p><p></p>',
        thumbnailUrl: 'https://www.example.com',
        isNeedPay: false,
        wordCount: 123,
        category: "歐洲",
        tags: ['冰島', '旅遊'],
      }
    }
    #swagger.responses[201] = {
      description: 'Article',
      schema: {
        statusCode: 0,
        message: 'Article created successfully',
        data: {
          articleId: '6671ac7cac8af0d4f5eaf2be'
        }
      }
    }
    #swagger.responses[400] = {
      description: 'Invalid field',
      schema: { statusCode: 1003, message: 'Invalid field (body)' }
    }
    #swagger.responses[401] = {
      description: 'Unauthorized',
      schema: { statusCode: 1002, message: 'Unauthorized' }
    }
    #swagger.responses[500] = {
      description: 'Internal server error',
      schema: { statusCode: 9999, message: 'Error while creating article' }
    }
  */
  authenticate,
  validateRequest(createArticleBodySchema, 'body'),
  articleController.createArticle
);

router.get(
  '/:articleId',
  /*
    #swagger.tags = ['Article']
    #swagger.description = 'Get an article by ID.'
    #swagger.parameters['articleId'] = { description: 'Article ID', required: true }
    #swagger.responses[200] = {
      description: 'Article',
      schema: {
        statusCode: 0,
        message: 'Article found',
        data: {
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
          creator: {
            id: '6671ac7a2e8af0d4f5e1c2be',
            profile: {
              displayName: "Render Lai",
              avatarImageUrl: "https://firebasestorage.googleapis.com/v0/b/journey-bites-frontend.appspot.com/o/userAvatar%2Frender3%40gmail.com%2Favatar-2.jpg?alt=media&token=e6477384-5601-48bf-8c85-e984637ece3a",
              bio: "嗨，大家好！我是 Render，一位熱愛旅行、探索世界的旅遊部落客。透過我的部落格，我將帶領你踏上一場充滿冒險、驚喜和文化交流的旅程。"
            }
          },
          status: {
            views: 0,
            likes: 0,
            subscriptions: 0,
            likedUsers: [
              {
                id: '6671ac7cac8af0d4f5eaf2be',
                profile: {
                  displayName: "Render Lai",
                  avatarImageUrl: "https://firebasestorage.googleapis.com/v0/b/journey-bites-frontend.appspot.com/o/userAvatar%2Frender3%40gmail.com%2Favatar-2.jpg?alt=media&token=e6477384-5601-48bf-8c85-e984637ece3a",
                  bio: "嗨，大家好！我是 Render，一位熱愛旅行、探索世界的旅遊部落客。透過我的部落格，我將帶領你踏上一場充滿冒險、驚喜和文化交流的旅程。"
                }
              }              
            ],
            favoriteBy: [
              {
                id: '6671ac7cac8af0d4f5eaf2be',
                profile: {
                  displayName: "Render Lai",
                  avatarImageUrl: "https://firebasestorage.googleapis.com/v0/b/journey-bites-frontend.appspot.com/o/userAvatar%2Frender3%40gmail.com%2Favatar-2.jpg?alt=media&token=e6477384-5601-48bf-8c85-e984637ece3a",
                  bio: "嗨，大家好！我是 Render，一位熱愛旅行、探索世界的旅遊部落客。透過我的部落格，我將帶領你踏上一場充滿冒險、驚喜和文化交流的旅程。"
                }
              }   
            ]
          }
        }
      }
    }
    #swagger.responses[400] = {
      description: 'Invalid field',
      schema: { statusCode: 1006, message: 'Invalid field (param)' }
    }
    #swagger.responses[404] = {
      description: 'Article not found',
      schema: { statusCode: 1007, message: 'Article not found' }
    }
    #swagger.responses[500] = {
      description: 'Internal server error',
      schema: { statusCode: 9999, message: 'Error while getting article' }
    }
  */
  authenticateOptional,
  validateParamsObjectIds(['articleId']),
  articleController.getArticle
);

router.patch(
  '/:articleId',
  /*
    #swagger.security = [{'Bearer': []}]
    #swagger.tags = ['Article']
    #swagger.description = 'Update an article.'
    #swagger.parameters['articleId'] = { description: 'Article ID', required: true }
    #swagger.parameters['payload'] = {
      in: 'body',
      description: 'Article data to update.',
      required: true,
      schema: {
        title: '冰島旅遊適合你嗎？──兩次造訪冰島後我學到的事',
        abstract: '像《白日夢冒險王》的班史提勒在遼闊公路上追夢？在極光、瀑布、懸崖前露出觀光客的滿足微笑？這些你對冰島旅遊的美好想像，可能都會在親訪後大失所望…',
        content: '<p>123</p><p></p>',
        thumbnailUrl: 'https://www.example.com',
        isNeedPay: false,
        wordCount: 123,
        category: "歐洲",
        tags: ['冰島', '旅遊'],
      }
    }
    #swagger.responses[200] = {
      description: 'Article',
      schema: {
        statusCode: 0,
        message: 'Article updated successfully',
        data: {
          articleId: '6671ac7cac8af0d4f5eaf2be'
        }
      }
    }
    #swagger.responses[400] = {
      description: 'Invalid field',
      schema: { statusCode: 1003, message: 'Invalid field (body)' }
    }
    #swagger.responses[400] = {
      description: 'Invalid field',
      schema: { statusCode: 1006, message: 'Invalid field (param)' }
    }
    #swagger.responses[401] = {
      description: 'Unauthorized',
      schema: { statusCode: 1002, message: 'Unauthorized' }
    }
    #swagger.responses[404] = {
      description: 'Article not found',
      schema: { statusCode: 1007, message: 'Article not found or you are not the creator of this article' }
    }
    #swagger.responses[500] = {
      description: 'Internal server error',
      schema: { statusCode: 9999, message: 'Error while updating article' }
    }
  */
  authenticate,
  validateParamsObjectIds(['articleId']),
  validateRequest(createArticleBodySchema.partial(), 'body'),
  articleController.updateArticle
);

router.delete(
  '/:articleId',
  /*
    #swagger.security = [{'Bearer': []}]
    #swagger.tags = ['Article']
    #swagger.description = 'Delete an article.'
    #swagger.parameters['articleId'] = { description: 'Article ID', required: true }
    #swagger.responses[204] = {
      description: 'Article deleted successfully'
    }
    #swagger.responses[400] = {
      description: 'Invalid field',
      schema: { statusCode: 1006, message: 'Invalid field (param)' }
    }
    #swagger.responses[401] = {
      description: 'Unauthorized',
      schema: { statusCode: 1002, message: 'Unauthorized' }
    }
    #swagger.responses[404] = {
      description: 'Article not found',
      schema: { statusCode: 1007, message: 'Article not found or you are not the creator of this article' }
    }
    #swagger.responses[500] = {
      description: 'Internal server error',
      schema: { statusCode: 9999, message: 'Error while deleting article' }
    }
  */
  authenticate,
  validateParamsObjectIds(['articleId']),
  articleController.deleteArticle
);

router.post(
  '/:articleId/like',
  /*
    #swagger.security = [{'Bearer': []}]
    #swagger.tags = ['Article']
    #swagger.description = 'Like an article.'
    #swagger.parameters['articleId'] = { description: 'Article ID', required: true }
    #swagger.responses[204] = {
      description: 'Article liked successfully'
    }
    #swagger.responses[400] = {
      description: 'Invalid field',
      schema: { statusCode: 1006, message: 'Invalid field (param)' }
    }
    #swagger.responses[401] = {
      description: 'Unauthorized',
      schema: { statusCode: 1002, message: 'Unauthorized' }
    }
    #swagger.responses[500] = {
      description: 'Internal server error',
      schema: { statusCode: 9999, message: 'Error while liking article' }
    }
  */
  authenticate,
  validateParamsObjectIds(['articleId']),
  articleController.likeArticle
);

router.delete(
  '/:articleId/like',
  /*
    #swagger.security = [{'Bearer': []}]
    #swagger.tags = ['Article']
    #swagger.description = 'Unlike an article.'
    #swagger.parameters['articleId'] = { description: 'Article ID', required: true }
    #swagger.responses[204] = {
      description: 'Article unliked successfully'
    }
    #swagger.responses[400] = {
      description: 'Invalid field',
      schema: { statusCode: 1006, message: 'Invalid field (param)' }
    }
    #swagger.responses[401] = {
      description: 'Unauthorized',
      schema: { statusCode: 1002, message: 'Unauthorized' }
    }
    #swagger.responses[500] = {
      description: 'Internal server error',
      schema: { statusCode: 9999, message: 'Error while unliking article' }
    }
  */
  authenticate,
  validateParamsObjectIds(['articleId']),
  articleController.unlikeArticle
);

router.post(
  '/:articleId/comment',
  /*
    #swagger.security = [{'Bearer': []}]
    #swagger.tags = ['Article']
    #swagger.description = 'Create a comment.'
    #swagger.parameters['articleId'] = { description: 'Article ID', required: true }
    #swagger.parameters['payload'] = {
      in: 'body',
      description: 'Comment data to create.',
      required: true,
      schema: {
        content: '好文！'
      }
    }
    #swagger.responses[201] = {
      description: 'Comment',
      schema: {
        statusCode: 0,
        message: 'Comment created successfully',
        data: {
          commentId: '6671ac7cac8af0d4f5eaf2be'
        }
      }
    }
    #swagger.responses[400] = {
      description: 'Invalid field',
      schema: { statusCode: 1003, message: 'Invalid field (body)' }
    }
    #swagger.responses[400] = {
      description: 'Invalid field',
      schema: { statusCode: 1006, message: 'Invalid field (param)' }
    }
    #swagger.responses[401] = {
      description: 'Unauthorized',
      schema: { statusCode: 1002, message: 'Unauthorized' }
    }
    #swagger.responses[500] = {
      description: 'Internal server error',
      schema: { statusCode: 9999, message: 'Error while creating comment' }
    }
  */
  authenticate,
  validateParamsObjectIds(['articleId']),
  validateRequest(commentRequestBodySchema, 'body'),
  articleController.addComment
);

router.get(
  '/:articleId/comments',
  /*
    #swagger.tags = ['Article']
    #swagger.description = 'Get comments of an article.'
    #swagger.parameters['articleId'] = { description: 'Article ID', required: true }
    #swagger.responses[200] = {
      description: 'Comments',
      schema: {
        statusCode: 0,
        message: 'Comments found',
        data: [
          {
            id: '6671ac7cac8af0d4f5eaf2be',
            content: '好文！',
            likes: 2,
            likedUserIds: [
              '6671ac7cac8af0d4f5eaf2be',
              '6671ac7cac8af0d4f5eaf2be'
            ],
            createdAt: "2024-06-22T15:27:41.815Z",
            updatedAt: "2024-06-22T15:27:41.815Z",
            creator: {
              id: '6671ac7a2e8af0d4f5e1c2be',
              profile: {
                displayName: "Render Lai",
                avatarImageUrl: "https://firebasestorage.googleapis.com/v0/b/journey-bites-frontend.appspot.com/o/userAvatar%2Frender3%40gmail.com%2Favatar-2.jpg?alt=media&token=e6477384-5601-48bf-8c85-e984637ece3a",
                bio: "嗨，大家好！我是 Render，一位熱愛旅行、探索世界的旅遊部落客。透過我的部落格，我將帶領你踏上一場充滿冒險、驚喜和文化交流的旅程。"
              }
            }
          }
        ]
      }
    }
    #swagger.responses[400] = {
      description: 'Invalid field',
      schema: { statusCode: 1006, message: 'Invalid field (param)' }
    }
    #swagger.responses[404] = {
      description: 'Comments not found',
      schema: { statusCode: 1007, message: 'Comments not found' }
    }
    #swagger.responses[500] = {
      description: 'Internal server error',
      schema: { statusCode: 9999, message: 'Error while getting comments' }
    }
  */
  validateParamsObjectIds(['articleId']),
  articleController.getComments
);

export default router;
