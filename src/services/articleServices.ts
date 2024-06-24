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
  categoryId: string;
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
        status: {
          omit: {
            id: true,
            likedUserIds: true,
          },
        },
      },
      omit: {
        wordCount: true,
        categoryId: true,
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
    console.log(error);
    throw new Error('Error while getting articles');
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
    console.log(error);
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
        status: {
          select: {
            views: true,
            likes: true,
            subscriptions: true,
            likedUsers: {
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
          },
        },
      },
      omit: {
        wordCount: true,
        categoryId: true,
        statusId: true,
        creatorId: true,
      },
    });

    return article;
  } catch (error) {
    console.log(error);
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
    await db.article.update({
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
  } catch (error) {
    throw new Error('Error while liking article');
  }
};

const unlikeArticle = async (userId: string, articleId: string) => {
  try {
    await db.article.update({
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
  } catch (error) {
    throw new Error('Error while unliking article');
  }
};

const createComment = async (userId: string, articleId: string, content: string) => {
  try {
    await db.comment.create({
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
  } catch (error) {
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
            profile: {
              select: {
                displayName: true,
                avatarImageUrl: true,
                bio: true,
              },
            },
          },
        },
      },
    });

    return comments;
  } catch (error) {
    throw new Error('Error while getting comments');
  }
};

export default {
  getArticles,
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
};
