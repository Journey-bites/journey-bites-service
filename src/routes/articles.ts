import { Router } from 'express';
import { z } from 'zod';

import articleController from '@/controllers/articleController';
import validateRequest from '@/middlewares/validateRequest';
import { paginationSchema } from '@/validateSchema/pagination';

const getCreatorsQuerySchema = paginationSchema.extend({
  q: z.string().optional(),
  type: z.enum(['hot']).or(z.string()).optional(),
  category: z.string().optional(),
});

const router = Router();

router.get(
  '/',
  /*
    #swagger.tags = ['Article']
    #swagger.description = 'Get articles.'
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
    #swagger.parameters['q'] = {
      in: 'query',
      description: 'Search article by title or abstract',
      required: false,
      type: 'string'
    }
    #swagger.parameters['type'] = {
      in: 'query',
      description: 'Type of search articles',
      required: false,
      type: 'string',
      enum: ['hot']
    }
    #swagger.parameters['category'] = {
      in: 'query',
      description: 'Category of articles',
      required: false,
      type: 'string'
    }
    #swagger.responses[200] = {
      description: 'Articles',
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
              subscriptions: 0
            },
            commentCount: 8
          },
        ]
      },
    }
    #swagger.responses[500] = {
      description: 'Internal server error',
      schema: { statusCode: 9999, message: 'Error while getting articles' }
    }
  */
  validateRequest(getCreatorsQuerySchema, 'query'),
  articleController.getArticles
);

export default router;
