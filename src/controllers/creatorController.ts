import { RequestHandler } from 'express';

import ErrorCode from '@/exceptions/ErrorCode';
import { HttpException } from '@/exceptions/HttpException';
import { UserNotFoundException } from '@/exceptions/UserNotFoundException';
import { SystemException } from '@/exceptions/SystemException';
import userService from '@/services/userService';
import { createResponse } from '@/utils/http';

type Method = 'getCreatorFollowers' | 'getCreatorFollowings';
type CreatorController = Record<Method, RequestHandler<{ creatorId: string }>>;

const creatorController: CreatorController = {
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
