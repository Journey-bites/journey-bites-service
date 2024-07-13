import { Prisma } from '@prisma/client';

import db from '@/db';
import { baseUserProfileQuery } from '@/db/queryCondition';
import { PrismaClientErrorCode } from '@/types/PrismaClientErrorCode';

type GetArticlesPayload = {
  page?: number;
  pageSize?: number;
  keyword?: string;
  category?: string;
};

type CreateArticlePayload = {
  title: string;
  abstract: string;
  content: string;
  isNeedPay: boolean;
  wordCount: number;
  categoryId: string;
  thumbnailUrl?: string;
  tags?: string[];
};

const getArticles = async ({ page = 1, pageSize = 10, keyword = '', category }: GetArticlesPayload) => {
  try {
    const articlesDetails = await db.article.findMany({
      where: {
        OR: [
          {
            title: {
              contains: keyword,
              mode: 'insensitive',
            },
          },
          {
            abstract: {
              contains: keyword,
              mode: 'insensitive',
            },
          },
        ],
        AND: {
          category: {
            name: {
              equals: category,
            },
          },
        },
      },
      include: {
        creator: {
          select: {
            id: true,
            profile: baseUserProfileQuery,
          },
        },
        category: {
          select: {
            name: true,
          },
        },
        _count: {
          select: {
            comments: true,
          },
        },
        status: {
          select: {
            views: true,
            likes: true,
            subscriptions: true,
            likedUsers: {
              select: {
                id: true,
                profile: baseUserProfileQuery,
              },
            },
          },
        },
      },
      omit: {
        wordCount: true,
        categoryId: true,
        creatorId: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    const formatArticlesDetails = articlesDetails.map((article) => {
      const { _count, status, ...rest } = article;

      return {
        ...rest,
        status: {
          ...status,
          likes: status?.likedUsers.length,
        },
        commentCount: _count.comments,
      };
    });

    return formatArticlesDetails;
  } catch (error) {
    throw new Error('Error while getting articles');
  }
};

const getPopularArticles = async ({ page = 1, pageSize = 10, category }: Omit<GetArticlesPayload, 'keyword'>) => {
  try {
    const articlesDetails = await db.article.findMany({
      where: {
        category: {
          name: {
            equals: category,
          },
        },
      },
      include: {
        creator: {
          select: {
            id: true,
            profile: {
              select: {
                displayName: true,
                avatarImageUrl: true,
                bio: true,
              },
            },
          },
        },
        category: {
          select: {
            name: true,
          },
        },
        _count: {
          select: {
            comments: true,
          },
        },
        status: {
          select: {
            views: true,
            likes: true,
            subscriptions: true,
          },
        },
      },
      omit: {
        wordCount: true,
        categoryId: true,
        creatorId: true,
      },
      orderBy: {
        status: {
          likes: 'desc',
        },
      },
    });

    const pageStart = (page - 1) * pageSize;
    const pageEnd = page * pageSize;

    const formatArticlesDetails = articlesDetails.slice(pageStart, pageEnd).map((article) => {
      const { _count, ...rest } = article;

      return {
        ...rest,
        commentCount: _count.comments,
      };
    });

    return formatArticlesDetails;
  } catch (error) {
    throw new Error('Error while getting articles');
  }
};

// TODO need check is creatorId exist
const getArticlesByCreatorId = async (creatorId: string) => {
  try {
    const articles = await db.article.findMany({
      where: {
        creatorId,
      },
      include: {
        category: {
          select: {
            name: true,
          },
        },
        status: {
          select: {
            views: true,
            likes: true,
            subscriptions: true,
          },
        },
        _count: {
          select: {
            comments: true,
          },
        },
      },
      omit: {
        wordCount: true,
        categoryId: true,
        creatorId: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    const formatArticles = articles.map((article) => {
      const { _count, ...rest } = article;
      return {
        ...rest,
        commentCount: _count.comments,
      };
    });

    return formatArticles;
  } catch (error) {
    throw new Error('Error while getting user articles');
  }
};

const createArticle = async (creatorId: string, payload: CreateArticlePayload) => {
  const readingTimes = () => {
    const wordsPerMinute: number = 200; // Average case.
    return Math.ceil(payload.wordCount / wordsPerMinute);
  };

  const { categoryId, ...articleInfo } = payload;

  try {
    const result = await db.article.create({
      data: {
        ...articleInfo,
        readTime: readingTimes(),
        category: {
          connect: {
            id: categoryId,
          },
        },
        status: {
          create: {},
        },
        creator: {
          connect: {
            id: creatorId,
          },
        },
      },
    });

    return result;
  } catch (error) {
    throw new Error('Error while creating article');
  }
};

const getArticleById = async (articleId: string) => {
  try {
    const article = await db.article.findUnique({
      where: {
        id: articleId,
      },
      include: {
        creator: {
          select: {
            id: true,
            profile: baseUserProfileQuery,
          },
        },
        category: {
          select: {
            name: true,
          },
        },
        status: {
          select: {
            views: true,
            likes: true,
            subscriptions: true,
            likedUsers: {
              select: {
                id: true,
                profile: baseUserProfileQuery,
              },
            },
            favoriteBy: {
              select: {
                id: true,
                profile: baseUserProfileQuery,
              },
            },
          },
        },
      },
      omit: {
        wordCount: true,
        categoryId: true,
        creatorId: true,
      },
    });

    if (!article?.status) return null;

    return {
      ...article,
      status: {
        ...article.status,
        likes: article.status.likedUsers.length,
      },
    };
  } catch (error) {
    throw new Error('Error while getting article');
  }
};

const getArticleByIdAndCreatorId = async (articleId: string, creatorId: string) => {
  try {
    const article = await db.article.findUnique({
      where: {
        id: articleId,
        creatorId,
      },
    });

    return article;
  } catch (error) {
    throw new Error('Error while getting article');
  }
};

const updateArticle = async (creatorId: string, articleId: string, payload: Partial<CreateArticlePayload>) => {
  try {
    const result = await db.article.update({
      where: {
        id: articleId,
        creatorId,
      },
      data: {
        ...payload,
      },
    });

    return result;
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === PrismaClientErrorCode.OperationFailedError
    ) {
      return false;
    }

    throw new Error('Error while updating article');
  }
};

const deleteArticle = async (creatorId: string, articleId: string) => {
  try {
    const result = await db.article.delete({
      where: {
        id: articleId,
        creatorId,
      },
    });

    return result;
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === PrismaClientErrorCode.OperationFailedError
    ) {
      return false;
    }

    throw new Error('Error while deleting article');
  }
};

const checkIsArticleLiked = async (userId: string, articleId: string) => {
  try {
    const article = await db.article.findUnique({
      where: {
        id: articleId,
      },
      include: {
        status: {
          select: {
            likedUsers: {
              where: {
                id: userId,
              },
            },
          },
        },
      },
    });

    if (!article?.status) {
      throw new Error('Article not found');
    }

    return article.status.likedUsers.length > 0;
  } catch (error) {
    throw new Error('Error while checking if article is liked');
  }
};

const likeArticle = async (userId: string, articleId: string) => {
  try {
    const result = await db.article.update({
      where: {
        id: articleId,
      },
      data: {
        status: {
          update: {
            likes: {
              increment: 1,
            },
            likedUsers: {
              connect: {
                id: userId,
              },
            },
          },
        },
      },
    });

    return result;
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === PrismaClientErrorCode.OperationFailedError
    ) {
      return false;
    }

    throw new Error('Error while liking article');
  }
};

const unlikeArticle = async (userId: string, articleId: string) => {
  try {
    const result = await db.article.update({
      where: {
        id: articleId,
      },
      data: {
        status: {
          update: {
            likes: {
              decrement: 1,
            },
            likedUsers: {
              disconnect: {
                id: userId,
              },
            },
          },
        },
      },
    });

    return result;
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === PrismaClientErrorCode.OperationFailedError
    ) {
      return false;
    }

    throw new Error('Error while unliking article');
  }
};

const createComment = async (userId: string, articleId: string, content: string) => {
  try {
    const result = await db.comment.create({
      data: {
        content,
        article: {
          connect: {
            id: articleId,
          },
        },
        user: {
          connect: {
            id: userId,
          },
        },
      },
    });

    return result;
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === PrismaClientErrorCode.OperationFailedError
    ) {
      return false;
    }

    throw new Error('Error while creating comment');
  }
};

const getComments = async (articleId: string) => {
  try {
    const comments = await db.comment.findMany({
      where: {
        articleId,
      },
      omit: {
        articleId: true,
        userId: true,
      },
      include: {
        user: {
          select: {
            id: true,
            profile: baseUserProfileQuery,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return comments;
  } catch (error) {
    throw new Error('Error while getting comments');
  }
};

const getArticlesLikedByUser = async (userId: string) => {
  try {
    const articles = await db.article.findMany({
      where: {
        status: {
          likedUsers: {
            some: {
              id: userId,
            },
          },
        },
      },
      include: {
        category: {
          select: {
            name: true,
          },
        },
        status: {
          select: {
            views: true,
            likes: true,
          },
        },
        creator: {
          select: {
            id: true,
            profile: {
              select: {
                displayName: true,
                avatarImageUrl: true,
              },
            },
          },
        },
        _count: {
          select: {
            comments: true,
          },
        },
      },
      omit: {
        wordCount: true,
        categoryId: true,
        creatorId: true,
        content: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    const formatArticles = articles.map((article) => {
      const { _count, category, ...rest } = article;
      return {
        ...rest,
        category: category.name,
        commentCount: _count.comments,
      };
    });

    return formatArticles;
  } catch (error) {
    throw new Error('Error while getting articles liked by user');
  }
};

export default {
  getArticles,
  getPopularArticles,
  getArticlesByCreatorId,
  createArticle,
  getArticleById,
  getArticleByIdAndCreatorId,
  updateArticle,
  deleteArticle,
  checkIsArticleLiked,
  likeArticle,
  unlikeArticle,
  createComment,
  getComments,
  getArticlesLikedByUser,
};
