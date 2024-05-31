import db from '@/db';

const findArticleHotByCount = async (count: number) => {
  return db.articles.findMany({
    include: {
      // status: true,
      status: {
        select: {
          views: true,
          likes: true,
          subscriptions: true,
        },
      },
    },

    orderBy: {
      status: {
        likes: 'desc',
      },
    },

    take: count > 0 ? count : undefined,
  });
};

export default {
  findArticleHotByCount,
};
