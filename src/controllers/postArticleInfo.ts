import { createResponse } from '@/utils/http';
import { NextFunction, Request, Response } from 'express';
import { HttpException } from '@/exceptions/HttpException';
import { SystemException } from '@/exceptions/SystemException';
import articleService from '@/services/articleService';
import { z } from 'zod';

interface RequestParams {}

interface ResponseBody {}

interface RequestBody {
  creator: string;
  title: string;
  abstract: string;
  content: string;
  thumbnailUrl: string;
  needsPay: boolean;
  wordsCount: number;
  tags: string[];
}

interface RequestQuery {}

const ArticleInputSchema = z.object({
  creator: z.string().min(1, 'Creator is required'),
  title: z.string().min(1, 'Title is required'),
  abstract: z.string().min(1, 'Abstract is required'),
  content: z.string().min(1, 'Content is required'),
  thumbnailUrl: z.string().min(1, 'Thumbnail URL is required'),
  needsPay: z.boolean(),
  wordsCount: z.number(),
  tags: z.array(z.string()),
});

const articleController = {
  postArticleInfo: async (
    req: Request<RequestParams, ResponseBody, RequestBody, RequestQuery>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const parsedInput = ArticleInputSchema.parse(req.body);
      await articleService.addArticle(parsedInput);

      return createResponse(res, {
        httpCode: 201,
        message: 'Create article success',
        data: {
          creator: parsedInput.creator,
          title: parsedInput.title,
        },
      });
    } catch (error) {
      if (error instanceof HttpException) {
        next(error);
        return;
      }

      throw new SystemException('Create article failed');
    }
  },
};

export default articleController;
