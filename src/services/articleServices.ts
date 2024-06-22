import db from '@/db';

type GetArticlesPayload = {
  page?: number;
  pageSize?: number;
  keyword?: string;
  type?: 'hot';
};

const getArticles = async ({ page = 1, pageSize = 10, keyword = '', type }: GetArticlesPayload) => {
  try {
    const articlesDetails = await db.articles.findMany({
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

export default {
  getArticles,
};
