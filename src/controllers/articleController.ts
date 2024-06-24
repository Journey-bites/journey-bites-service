import { Request, Response, NextFunction } from 'express';

import { HttpException } from '@/exceptions/HttpException';
import { ResourceNotFoundException } from '@/exceptions/ResourceNotFoundException';
import { InvalidIdException } from '@/exceptions/InvalidIdException';
import { SystemException } from '@/exceptions/SystemException';
import categoryServices from '@/services/categoryServices';
import articleServices from '@/services/articleServices';
import { CreateArticleRequestBody } from '@/validateSchema/createArticleRequest';
import { Pagination } from '@/validateSchema/pagination';
import asyncHandler from '@/utils/asyncHandler';
import { isValidObjectId } from '@/utils/dbHelper';
import { createResponse } from '@/utils/http';

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

interface AddCommentRequest extends Request {
  params: {
    articleId: string;
  };
  body: {
    content: string;
  };
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

      const formatArticles = articles.map((article) => ({
        ...article,
        category: article.category.name,
      }));

      return createResponse(res, {
        data: formatArticles,
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
    const { category, ...payload } = req.body;

    try {
      const categoryDetail = await categoryServices.getCategoryByName(category);

      if (!categoryDetail) {
        throw new ResourceNotFoundException('Category not found');
      }

      await articleServices.createArticle(creatorId, { ...payload, categoryId: categoryDetail.id });

      return createResponse(res, {
        httpCode: 201,
        message: 'Article created successfully',
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

      const article = await articleServices.getArticleById(articleId);

      if (!article) {
        throw new ResourceNotFoundException('Article not found');
      }

      return createResponse(res, {
        message: 'Article found',
        data: {
          ...article,
          category: article.category.name,
        },
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
      const { category, ...payload } = req.body;

      try {
        if (!isValidObjectId(articleId)) {
          throw new InvalidIdException('Invalid article ID');
        }

        const result = await articleServices.getArticleByIdAndCreatorId(articleId, creatorId);

        if (!result) {
          throw new ResourceNotFoundException('Article not found or you are not the creator of this article');
        }

        let categoryId: string | undefined;
        if (category) {
          const categoryDetail = await categoryServices.getCategoryByName(category);

          categoryId = categoryDetail?.id;
          if (!categoryDetail) {
            throw new ResourceNotFoundException('Category not found');
          }
        }

        await articleServices.updateArticle(creatorId, articleId, { ...payload, categoryId });

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

      const result = await articleServices.getArticleByIdAndCreatorId(articleId, creatorId);

      if (!result) {
        throw new ResourceNotFoundException('Article not found');
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
  likeArticle: asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user.id;
    const articleId = req.params.articleId;

    try {
      if (!isValidObjectId(articleId)) {
        throw new InvalidIdException('Invalid article ID');
      }

      const result = await articleServices.getArticleById(articleId);

      if (!result) {
        throw new ResourceNotFoundException('Article not found');
      }

      const isLiked = await articleServices.checkIsArticleLiked(userId, articleId);

      if (isLiked) {
        return createResponse(res, {
          httpCode: 400,
          message: 'Article already liked',
        });
      }

      await articleServices.likeArticle(userId, articleId);

      return createResponse(res, { httpCode: 204 });
    } catch (error) {
      if (error instanceof HttpException) {
        next(error);
        return;
      }

      throw new SystemException('Error while liking article');
    }
  }),
  unlikeArticle: asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user.id;
    const articleId = req.params.articleId;

    try {
      if (!isValidObjectId(articleId)) {
        throw new InvalidIdException('Invalid article ID');
      }

      const result = await articleServices.getArticleById(articleId);

      if (!result) {
        throw new ResourceNotFoundException('Article not found');
      }

      const isLiked = await articleServices.checkIsArticleLiked(userId, articleId);

      if (!isLiked) {
        return createResponse(res, {
          httpCode: 400,
          message: 'Article not liked yet',
        });
      }

      await articleServices.unlikeArticle(userId, articleId);

      return createResponse(res, { httpCode: 204 });
    } catch (error) {
      if (error instanceof HttpException) {
        next(error);
        return;
      }

      throw new SystemException('Error while unliking article');
    }
  }),
  addComment: asyncHandler(async (req: AddCommentRequest, res: Response, next: NextFunction) => {
    const userId = req.user.id;
    const articleId = req.params.articleId;
    const { content } = req.body;

    try {
      if (!isValidObjectId(articleId)) {
        throw new InvalidIdException('Invalid article ID');
      }

      const result = await articleServices.getArticleById(articleId);

      if (!result) {
        throw new ResourceNotFoundException('Article not found');
      }

      await articleServices.createComment(userId, articleId, content);

      return createResponse(res, {
        message: 'Comment added successfully',
      });
    } catch (error) {
      if (error instanceof HttpException) {
        next(error);
        return;
      }

      throw new SystemException('Error while adding comment');
    }
  }),
  getComments: asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const articleId = req.params.articleId;

    try {
      if (!isValidObjectId(articleId)) {
        throw new InvalidIdException('Invalid article ID');
      }

      const result = await articleServices.getArticleById(articleId);

      if (!result) {
        throw new ResourceNotFoundException('Article not found');
      }

      const commentsDetails = await articleServices.getComments(articleId);

      const comments = commentsDetails.map((comment) => ({
        ...comment,
        likes: comment.likedUserIds.length,
      }));

      return createResponse(res, {
        data: comments,
      });
    } catch (error) {
      if (error instanceof HttpException) {
        next(error);
        return;
      }

      throw new SystemException('Error while getting comments');
    }
  }),
};

export default articleController;
