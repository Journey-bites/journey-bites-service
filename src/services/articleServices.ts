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
  thumbnailUrl: string;
  isNeedPay: boolean;
  wordCount: number;
  tags: string[];
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
      omit: {
        statusId: true,
      },
      include: {
        status: {
          omit: {
            id: true,
          },
        },
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

export default {
  getArticles,
  createArticle,
};
