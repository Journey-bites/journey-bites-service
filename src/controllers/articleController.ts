import { Request, Response, NextFunction } from 'express';

import { HttpException } from '@/exceptions/HttpException';
import ErrorCode from '@/exceptions/ErrorCode';
import { ResourceNotFoundException } from '@/exceptions/ResourceNotFoundException';
import { SystemException } from '@/exceptions/SystemException';
import categoryServices from '@/services/categoryService';
import articleService from '@/services/articleService';
import { CreateArticleRequestBody } from '@/validateSchema/createArticleRequest';
import { Pagination } from '@/validateSchema/pagination';
import asyncHandler from '@/utils/asyncHandler';
import { createResponse } from '@/utils/http';
import { truncateHtml } from '@/utils/truncate';
import userService from '@/services/userService';

type GetArticlesRequest = Request & {
  query: Partial<Pagination> & {
    q?: string;
    type?: 'hot';
    category?: string;
  };
};

interface ArticlesRequest extends Request {
  params: {
    articleId: string;
  };
}

interface CreateArticleRequest extends Request {
  body: CreateArticleRequestBody;
}

interface UpdateArticleRequest extends ArticlesRequest {
  body: Partial<CreateArticleRequestBody>;
}

interface AddCommentRequest extends ArticlesRequest {
  body: {
    content: string;
  };
}

const articleController = {
  getArticles: asyncHandler(async (req: GetArticlesRequest, res: Response, next: NextFunction) => {
    const { page, pageSize, q, type, category } = req.query;

    try {
      const articles =
        type === 'hot'
          ? await articleService.getPopularArticles({
              page,
              pageSize,
              category,
            })
          : await articleService.getArticles({
              page,
              pageSize,
              keyword: q?.trim(),
              category,
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
    const userId = req.user.id;
    const { category, ...payload } = req.body;

    try {
      const categoryDetail = await categoryServices.getCategoryByName(category);

      if (!categoryDetail) {
        throw new ResourceNotFoundException('Category not found');
      }

      const article = await articleService.createArticle(userId, { ...payload, categoryId: categoryDetail.id });

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
  getArticle: asyncHandler(async (req: ArticlesRequest, res: Response, next: NextFunction) => {
    const { articleId } = req.params;
    const userId = req?.user?.id;

    try {
      const article = await articleService.getArticleById(articleId);

      if (!article) {
        throw new ResourceNotFoundException('Article not found');
      }

      let result;
      let isSubscribed;

      if (article.creator.id === userId || !article.isNeedPay) {
        result = article;
      } else {
        if (userId) {
          isSubscribed = await userService.checkIsUserSubscribed(userId, article.creator.id);
        }

        if (isSubscribed) {
          result = article;
        } else {
          const content = truncateHtml(article.content);
          result = {
            ...article,
            content,
          };
        }
      }

      return createResponse(res, {
        message: 'Article found',
        data: {
          ...result,
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
      const userId = req.user.id;
      const { articleId } = req.params;
      const { category, ...payload } = req.body;

      try {
        const result = await articleService.getArticleByIdAndCreatorId(articleId, userId);

        if (!result) {
          throw new ResourceNotFoundException('Article not found or you are not the creator of this article');
        }

        let categoryId: string | undefined;
        if (category) {
          const categoryDetail = await categoryServices.getCategoryByName(category);

          if (!categoryDetail) {
            throw new ResourceNotFoundException('Category not found');
          }

          categoryId = categoryDetail.id;
        }

        await articleService.updateArticle(userId, articleId, { ...payload, categoryId });

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
  deleteArticle: asyncHandler(async (req: ArticlesRequest, res: Response, next: NextFunction) => {
    const userId = req.user.id;
    const { articleId } = req.params;

    try {
      const result = await articleService.deleteArticle(userId, articleId);

      if (!result) {
        throw new ResourceNotFoundException('Article not found or you are not the creator of this article');
      }

      return createResponse(res, { httpCode: 204 });
    } catch (error) {
      if (error instanceof HttpException) {
        next(error);
        return;
      }

      throw new SystemException('Error while deleting article');
    }
  }),
  likeArticle: asyncHandler(async (req: ArticlesRequest, res: Response, next: NextFunction) => {
    const userId = req.user.id;
    const { articleId } = req.params;

    try {
      await articleService.likeArticle(userId, articleId);

      return createResponse(res, { httpCode: 204 });
    } catch (error) {
      if (error instanceof HttpException) {
        next(error);
        return;
      }

      throw new SystemException('Error while liking article');
    }
  }),
  unlikeArticle: asyncHandler(async (req: ArticlesRequest, res: Response, next: NextFunction) => {
    const userId = req.user.id;
    const { articleId } = req.params;

    try {
      await articleService.unlikeArticle(userId, articleId);

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
    const { articleId } = req.params;
    const { content } = req.body;

    try {
      const result = await articleService.createComment(userId, articleId, content);

      if (!result) {
        throw new ResourceNotFoundException('Article not found');
      }

      return createResponse(res, {
        httpCode: 201,
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
  getComments: asyncHandler(async (req: ArticlesRequest, res: Response, next: NextFunction) => {
    const { articleId } = req.params;

    try {
      const result = await articleService.getArticleById(articleId);

      if (!result) {
        throw new ResourceNotFoundException('Article not found');
      }

      const commentsDetails = await articleService.getComments(articleId);

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
