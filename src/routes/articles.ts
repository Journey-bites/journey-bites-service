import { Router } from 'express';

import articleController from '@/controllers/articleController';

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
    #swagger.responses[200] = {
      description: 'Articles',
      schema: {
        statusCode: 0,
        message: 'success',
        data: [
          {
            id: '6671ac7cac8af0d4f5eaf2be',
            creator: '666b4090cfc19969b955ca83',
            title: '冰島旅遊適合你嗎？──兩次造訪冰島後我學到的事',
            abstract: '像《白日夢冒險王》的班史提勒在遼闊公路上追夢？在極光、瀑布、懸崖前露出觀光客的滿足微笑？這些你對冰島旅遊的美好想像，可能都會在親訪後大失所望。分別在秋季、夏季踏上冰島的作者，比較兩者的旅行體驗差異，並帶來當地最真實的氣候、路況指南。',
            content: '<p>123</p><p></p>',
            imageUrl: 'https://cw-image-resizer.cwg.tw/resize/uri/https%3A%2F%2Fstorage.googleapis.com%2Fcrossing-cms-cwg-tw%2Farticle%2F202205%2Farticle-6274da3fed0eb.jpg/?w=1170&format=webp',
            needsPay: false,
            wordsCount: 3,
            readingTime: 1,
            createdAt: '2024-06-18T15:49:16.006Z',
            updatedAt: '2024-06-18T15:49:16.006Z',
            status: {
                views: 0,
                likes: 0,
                subscriptions: 0
            }
          },
        ]
      },
    }
  */

  articleController.getArticles
);

export default router;
