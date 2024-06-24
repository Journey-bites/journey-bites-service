import { Request, Response, NextFunction } from 'express';

import { HttpException } from '@/exceptions/HttpException';
import { SystemException } from '@/exceptions/SystemException';
import { UserNotFoundException } from '@/exceptions/UserNotFoundException';
import { InvalidIdException } from '@/exceptions/InvalidIdException';
import articleServices from '@/services/articleServices';
import creatorService from '@/services/creatorService';
import userService from '@/services/userService';
import { GetCreatorInfoData } from '@/types/comm';
import { Pagination } from '@/validateSchema/pagination';
import asyncHandler from '@/utils/asyncHandler';
import { isValidObjectId } from '@/utils/dbHelper';
import { createResponse } from '@/utils/http';

type GetCreatorsRequest = Request & {
  query: Partial<Pagination> & {
    type?: 'hot' | 'random';
    search?: string;
  };
};

type GetCreatorFollowersRequest = Request & {
  params: {
    creatorId: string;
  };
};

type GetCreatorFollowingsRequest = Request & {
  params: {
    creatorId: string;
  };
};

type GetCreatorInfoRequest = Request & {
  params: {
    creatorId: string;
  };
};

const creatorController = {
  getCreators: asyncHandler(async (req: GetCreatorsRequest, res: Response, next: NextFunction) => {
    const { page, pageSize, type, search } = req.query;
    try {
      const creators = await creatorService.getCreators({
        page,
        pageSize,
        type,
        keyword: search?.trim(),
      });

      return createResponse(res, {
        data: creators,
      });
    } catch (error) {
      if (error instanceof HttpException) {
        next(error);
        return;
      }

      throw new SystemException('Error while getting creators');
    }
  }),
  getCreatorInfo: asyncHandler(async (req: GetCreatorInfoRequest, res: Response, next: NextFunction) => {
    const { creatorId } = req.params;

    try {
      if (!isValidObjectId(creatorId)) {
        throw new InvalidIdException('Invalid article ID');
      }
      const creator = await creatorService.getCreatorById(creatorId);

      if (!creator) {
        throw new UserNotFoundException("Creator doesn't exist");
      }

      const { _count, email, id } = creator;

      const data: GetCreatorInfoData = {
        userId: id,
        email,
        ...creator.profile,
        followersCount: _count.followedBy,
      };

      if (req.user?.id) {
        const creatorFollowers = await userService.getUserFollowers(creatorId);
        if (creatorFollowers) {
          data.userAlreadyFollowed = Boolean(creatorFollowers.find((follower) => follower.userId === req.user.id));
        }
      }

      return createResponse(res, {
        data,
      });
    } catch (error) {
      if (error instanceof HttpException) {
        next(error);
        return;
      }

      throw new SystemException('Error while getting creator info');
    }
  }),
  getCreatorFollowers: asyncHandler(async (req: GetCreatorFollowersRequest, res: Response, next: NextFunction) => {
    const { creatorId } = req.params;

    try {
      if (!isValidObjectId(creatorId)) {
        throw new InvalidIdException('Invalid article ID');
      }

      const followers = await userService.getUserFollowers(creatorId);

      return createResponse(res, {
        data: followers,
      });
    } catch (error) {
      if (error instanceof HttpException) {
        next(error);
        return;
      }

      throw new SystemException('Error while getting creator followers');
    }
  }),
  getCreatorFollowings: asyncHandler(async (req: GetCreatorFollowingsRequest, res: Response, next: NextFunction) => {
    const { creatorId } = req.params;

    try {
      if (!isValidObjectId(creatorId)) {
        throw new InvalidIdException('Invalid article ID');
      }

      const followings = await userService.getUserFollowings(creatorId);

      return createResponse(res, {
        data: followings,
      });
    } catch (error) {
      if (error instanceof HttpException) {
        next(error);
        return;
      }

      throw new SystemException('Error while getting creator followings');
    }
  }),

  getCreatorArticles: asyncHandler(async (req: GetCreatorInfoRequest, res: Response, next: NextFunction) => {
    const { creatorId } = req.params;

    try {
      if (!isValidObjectId(creatorId)) {
        throw new InvalidIdException('Invalid article ID');
      }

      const articles = await articleServices.getArticlesByCreatorId(creatorId);

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

      throw new SystemException('Error while getting creator articles');
    }
  }),
};

export default creatorController;
