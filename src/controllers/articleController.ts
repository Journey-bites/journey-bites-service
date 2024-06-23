import { Request, Response, NextFunction } from 'express';

import { HttpException } from '@/exceptions/HttpException';
import { ResourceNotFoundException } from '@/exceptions/ResourceNotFoundException';
import { InvalidIdException } from '@/exceptions/InvalidIdException';
import { SystemException } from '@/exceptions/SystemException';
import articleServices from '@/services/articleServices';
import { CreateArticleRequestBody } from '@/validateSchema/createArticleRequest';
import { Pagination } from '@/validateSchema/pagination';
import { createResponse } from '@/utils/http';
import { isValidObjectId } from '@/utils/dbHelper';
import asyncHandler from '@/utils/asyncHandler';

type GetArticlesRequest = Request & {
  query: Partial<Pagination> & {
    q?: string;
    type?: 'hot';
  };
};

interface CreateArticleRequest extends Request {
  body: CreateArticleRequestBody;
}

interface UpdateArticleRequest extends Request {
  params: {
    articleId: string;
  };
  body: Partial<CreateArticleRequestBody>;
}

const articleController = {
  getArticles: asyncHandler(async (req: GetArticlesRequest, res: Response, next: NextFunction) => {
    const { page, pageSize, q, type } = req.query;

    try {
      const articles = await articleServices.getArticles({
        page,
        pageSize,
        keyword: q?.trim(),
        type,
      });

      return createResponse(res, {
        data: articles,
      });
    } catch (error) {
      if (error instanceof HttpException) {
        next(error);
        return;
      }

      throw new SystemException('Error while getting articles');
    }
  }),
  createArticle: asyncHandler(async (req: CreateArticleRequest, res: Response, next: NextFunction) => {
    const creatorId = req.user.id;

    try {
      const article = await articleServices.createArticle(creatorId, req.body);

      return createResponse(res, {
        httpCode: 201,
        message: 'Article created successfully',
        data: {
          articleId: article.id,
        },
      });
    } catch (error) {
      if (error instanceof HttpException) {
        next(error);
        return;
      }

      throw new SystemException('Error while creating article');
    }
  }),
  getArticle: asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const articleId = req.params.articleId;

    try {
      if (!isValidObjectId(articleId)) {
        throw new InvalidIdException('Invalid article ID');
      }

      const result = await articleServices.getArticleById(articleId);

      if (!result) {
        throw new ResourceNotFoundException('Article not found');
      }

      return createResponse(res, {
        message: 'Article found',
        data: result,
      });
    } catch (error) {
      if (error instanceof HttpException) {
        next(error);
        return;
      }

      throw new SystemException('Error while getting article');
    }
  }),
  updateArticle: asyncHandler<UpdateArticleRequest>(
    async (req: UpdateArticleRequest, res: Response, next: NextFunction) => {
      const creatorId = req.user.id;
      const articleId = req.params.articleId;

      try {
        if (!isValidObjectId(articleId)) {
          throw new InvalidIdException('Invalid article ID');
        }

        await articleServices.updateArticle(creatorId, articleId, req.body);

        return createResponse(res, {
          message: 'Article updated successfully',
        });
      } catch (error) {
        if (error instanceof HttpException) {
          next(error);
          return;
        }

        throw new SystemException('Error while updating article');
      }
    }
  ),
  deleteArticle: asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const creatorId = req.user.id;
    const articleId = req.params.articleId;

    try {
      if (!isValidObjectId(articleId)) {
        throw new InvalidIdException('Invalid article ID');
      }

      await articleServices.deleteArticle(creatorId, articleId);

      return createResponse(res, { httpCode: 204 });
    } catch (error) {
      if (error instanceof HttpException) {
        next(error);
        return;
      }

      throw new SystemException('Error while deleting article');
    }
  }),
};

export default articleController;
