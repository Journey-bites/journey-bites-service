import db from '@/db';

interface ArticleInput {
  creator: string;
  title: string;
  abstract: string;
  content: string;
  thumbnailUrl: string;
  needsPay: boolean;
  wordsCount: number;
  tags: string[];
}

const addArticle = async (articleInput: ArticleInput) => {
  const readingTimes = () => {
    const wordsPerMinute: number = 200; // Average case.
    return Math.ceil(articleInput.wordsCount / wordsPerMinute);
  };

  try {
    return db.articles.create({
      data: {
        ...articleInput,
        readingTime: readingTimes(),
        status: {
          create: {
            likes: 0,
            views: 0,
            subscriptions: 0,
          },
        },
        creator: {
          connect: {
            id: articleInput.creator,
          },
        },
      },
    });
  } catch (error) {
    throw new Error('Error while creating a new article');
  }
};

export default {
  addArticle,
};
