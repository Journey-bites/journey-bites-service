import db from '@/db';

const addArticle = async (
  creator: string,
  title: string,
  abstract: string,
  content: string,
  thumbnailUrl: string,
  needsPay: boolean,
  wordsCount: number,
  tags: string[]
) => {
  const readingTimes = () => {
    const wordsPerMinute: number = 200; // Average case.
    // return Math.ceil(countWords(content) / wordsPerMinute);
    return Math.ceil(wordsCount / wordsPerMinute);
  };

  return db.articles.create({
    data: {
      creator,
      title,
      abstract,
      content,
      thumbnailUrl,
      needsPay,
      wordsCount: wordsCount,
      readingTime: readingTimes(),
      tags,
      status: {
        create: {
          likes: 0,
          views: 0,
          subscriptions: 0,
        },
      },
    },
  });
};
export default {
  addArticle,
};
