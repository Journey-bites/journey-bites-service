import { createResponse } from '@/utils/http';
import { NextFunction, Request, Response } from 'express';
import { HttpException } from '@/exceptions/HttpException';
import { SystemException } from '@/exceptions/SystemException';
import articleService from '@/services/articleService';

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

const articleController = {
  postArticleInfo: async (
    req: Request<RequestParams, ResponseBody, RequestBody, RequestQuery>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { creator, title, abstract, content, thumbnailUrl, needsPay, wordsCount, tags } = req.body;

      await articleService.addArticle(creator, title, abstract, content, thumbnailUrl, needsPay, wordsCount, tags);

      return createResponse(res, {
        message: 'Create article success',
        data: {
          creator,
          title,
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
