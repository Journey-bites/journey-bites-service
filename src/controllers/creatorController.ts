import { Request, Response, NextFunction } from 'express';

import { HttpException } from '@/exceptions/HttpException';
import { SystemException } from '@/exceptions/SystemException';
import creatorService from '@/services/creatorService';
import userService from '@/services/userService';
import { createResponse } from '@/utils/http';
import { Pagination } from '@/validateSchema/pagination';

type GetCreatorsRequest = Request & {
  query: Pagination;
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

const creatorController = {
  getCreators: async (req: GetCreatorsRequest, res: Response, next: NextFunction) => {
    const { page, pageSize } = req.query;
    try {
      const creators = await creatorService.getCreators(page, pageSize);

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
  },
  getCreatorFollowers: async (req: GetCreatorFollowersRequest, res: Response, next: NextFunction) => {
    try {
      const followers = await userService.getUserFollowers(req.params.creatorId);

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
  },
  getCreatorFollowings: async (req: GetCreatorFollowingsRequest, res: Response, next: NextFunction) => {
    try {
      const followings = await userService.getUserFollowings(req.params.creatorId);

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
  },
};

export default creatorController;
