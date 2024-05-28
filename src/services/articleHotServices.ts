import prisma from '@/db';

const findArticleHotByCount = async (count: number) => {
  return prisma.articles.findMany({
    include: {
      status: true,
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
