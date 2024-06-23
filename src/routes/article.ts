import { Router } from 'express';

import articleController from '@/controllers/articleController';
import authenticate from '@/middlewares/authenticate';
import validateRequest from '@/middlewares/validateRequest';
import { createArticleBodySchema } from '@/validateSchema/createArticleRequest';

const router = Router();

router.post(
  '/',
  /*
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
      schema: { statusCode: 1001, message: 'Unauthorized' }
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

router.patch(
  '/:articleId',
  /*
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
    #swagger.responses[401] = {
      description: 'Unauthorized',
      schema: { statusCode: 1001, message: 'Unauthorized' }
    }
    #swagger.responses[500] = {
      description: 'Internal server error',
      schema: { statusCode: 9999, message: 'Error while updating article' }
    }
  */
  authenticate,
  validateRequest(createArticleBodySchema.partial(), 'body'),
  articleController.updateArticle
);

router.delete(
  '/:articleId',
  /*
    #swagger.tags = ['Article']
    #swagger.description = 'Delete an article.'
    #swagger.parameters['articleId'] = { description: 'Article ID', required: true }
    #swagger.responses[204] = {
      description: 'Article deleted successfully'
    }
    #swagger.responses[401] = {
      description: 'Unauthorized',
      schema: { statusCode: 1001, message: 'Unauthorized' }
    }
    #swagger.responses[500] = {
      description: 'Internal server error',
      schema: { statusCode: 9999, message: 'Error while deleting article' }
    }
  */
  authenticate,
  articleController.deleteArticle
);

export default router;
