import db from '@/db';

type GetArticlesPayload = {
  page?: number;
  pageSize?: number;
  keyword?: string;
  type?: 'hot';
};

type CreateArticlePayload = {
  title: string;
  abstract: string;
  content: string;
  isNeedPay: boolean;
  wordCount: number;
  thumbnailUrl?: string;
  tags?: string[];
};

const getArticles = async ({ page = 1, pageSize = 10, keyword = '', type }: GetArticlesPayload) => {
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
      },
      include: {
        creator: {
          select: {
            profile: {
              select: {
                displayName: true,
                avatarImageUrl: true,
                bio: true,
              },
            },
          },
        },
        status: {
          omit: {
            id: true,
          },
        },
      },
      omit: {
        wordCount: true,
        statusId: true,
        creatorId: true,
      },
      orderBy:
        type === 'hot'
          ? {
              status: {
                likes: 'desc',
              },
            }
          : undefined,
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    return articlesDetails;
  } catch (error) {
    throw new Error('Error while getting articles');
  }
};

const createArticle = async (creatorId: string, payload: CreateArticlePayload) => {
  const readingTimes = () => {
    const wordsPerMinute: number = 200; // Average case.
    return Math.ceil(payload.wordCount / wordsPerMinute);
  };

  try {
    const result = await db.article.create({
      data: {
        ...payload,
        readTime: readingTimes(),
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
            profile: {
              select: {
                displayName: true,
                avatarImageUrl: true,
                bio: true,
              },
            },
          },
        },
        status: {
          omit: {
            id: true,
          },
        },
      },
      omit: {
        wordCount: true,
        statusId: true,
        creatorId: true,
      },
    });

    return article;
  } catch (error) {
    throw new Error('Error while getting article');
  }
};

const getArticleByIdAndCreatorId = async (articleId: string, creatorId: string) => {
  try {
    const article = await db.article.findFirst({
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
    await db.article.update({
      where: {
        id: articleId,
        creatorId,
      },
      data: {
        ...payload,
      },
    });
  } catch (error) {
    throw new Error('Error while updating article');
  }
};

const deleteArticle = async (creatorId: string, articleId: string) => {
  try {
    await db.article.delete({
      where: {
        id: articleId,
        creatorId,
      },
    });
  } catch (error) {
    throw new Error('Error while deleting article');
  }
};

export default {
  getArticles,
  createArticle,
  getArticleById,
  getArticleByIdAndCreatorId,
  updateArticle,
  deleteArticle,
};
