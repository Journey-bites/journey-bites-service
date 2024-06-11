import { RequestHandler } from 'express';

import { HttpException } from '@/exceptions/HttpException';
import { SystemException } from '@/exceptions/SystemException';
import creatorService from '@/services/creatorService';
import userService from '@/services/userService';
import { createResponse } from '@/utils/http';
import { paginationSchema } from '@/validateSchema/pagination';

type Method = 'getCreators' | 'getCreatorFollowers' | 'getCreatorFollowings';
type CreatorController = Record<Method, RequestHandler<{ creatorId: string }>>;

const creatorController: CreatorController = {
  getCreators: async (req, res, next) => {
    try {
      const { page, pageSize } = paginationSchema.parse(req.query);
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
  getCreatorFollowers: async (req, res, next) => {
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
  getCreatorFollowings: async (req, res, next) => {
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
