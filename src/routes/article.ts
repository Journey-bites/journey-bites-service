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
      description: 'User information',
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
        message: 'success',
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

router.get(
  '/:id',
  /*
    #swagger.tags = ['Article']
    #swagger.description = 'Get a article.'
    #swagger.responses[200] = {
      description: 'Article',
      schema: {
        "statusCode": 0,
        "message": "Getting Article successfully",
        "data": {
          "id": "66779513be2c24b0aae0deb4",
          "title": "森林深處的秘境",
          "abstract": "森林深處，有一處秘境，隱藏在茂密的樹木之中。這裡是動植物的天堂，充滿了生命的奇蹟。",
          "content": "<p class='mb-6'>穿越茂密的森林，眼前豁然開朗，一片美麗的秘境展現在眼前。這裡的每一寸土地，都充滿了生命的氣息。</p><img class='rounded-lg my-9' src='https://unsplash.com/photos/a-mountain-with-trees-and-a-body-of-water-in-the-background-j3YMDeAATqk'><p class='mb-6'>各種各樣的花草樹木，爭奇鬥豔，展示著大自然的無窮魅力。這裡是動物們的天堂，鳥兒在枝頭歌唱，昆蟲在草叢中忙碌。</p><img class='rounded-lg my-9' src='https://unsplash.com/photos/sunlight-through-trees-A5rCN8626Ck'><p class='mb-6'>流水潺潺，清泉如鏡，給人一種心靈的洗滌。這裡的每一個角落，都讓人感受到大自然的神奇與美好。</p><p class='mb-6'>在這片秘境中，人們可以找到內心的平靜與安寧，遠離城市的喧囂，享受片刻的寧靜。</p><img class='rounded-lg my-9' src='https://unsplash.com/photos/a-couple-of-people-standing-next-to-a-tent-in-a-forest-6znh2Jq8yMM'>",
          "thumbnailUrl": "https://plus.unsplash.com/premium_photo-1682390303849-9cf52609ce82?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
          "isNeedPay": false,
          "readTime": 4,
          "tags": [
            "Forest",
            "Nature"
          ],
          "createdAt": "2024-06-23T03:22:59.557Z",
          "updatedAt": "2024-06-23T03:22:59.557Z",
          "status": {
            "views": 0,
            "likes": 0,
            "subscriptions": 0
          },
          "creator": {
            "profile": {
              "displayName": "Render Lai",
              "avatarImageUrl": "https://firebasestorage.googleapis.com/v0/b/journey-bites-frontend.appspot.com/o/userAvatar%2Frender3%40gmail.com%2Favatar-2.jpg?alt=media&token=e6477384-5601-48bf-8c85-e984637ece3a",
              "bio": "嗨，大家好！我是 Render，一位熱愛旅行、探索世界的旅遊部落客。透過我的部落格，我將帶領你踏上一場充滿冒險、驚喜和文化交流的旅程。"
            }
          }
        }
      }
    }
    #swagger.responses[500] = {
      description: 'Internal server error',
      schema: { statusCode: 9999, message: 'Error while getting Article' }
    }
  */
  articleController.getArticle
);

export default router;
