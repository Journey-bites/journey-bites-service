import { Request, Response, NextFunction } from 'express';

import { HttpException } from '@/exceptions/HttpException';
import { SystemException } from '@/exceptions/SystemException';
import creatorService from '@/services/creatorService';
import userService from '@/services/userService';
import { createResponse } from '@/utils/http';
import { Pagination } from '@/validateSchema/pagination';
import { UserNotFoundException } from '@/exceptions/UserNotFoundException';
import authorityRepository from '@/repositories/authorityRepository';
import { GetCreatorInfoData } from '@/types/comm';

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
  getCreators: async (req: GetCreatorsRequest, res: Response, next: NextFunction) => {
    const { page, pageSize, type, search } = req.query;
    try {
      const creators = await creatorService.getCreators({
        page,
        pageSize,
        type,
        searchName: search?.trim(),
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
  getCreatorInfo: async (req: GetCreatorInfoRequest, res: Response, next: NextFunction) => {
    try {
      const creator = await creatorService.getCreatorById(req.params.creatorId);

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

      const authHeader = req.headers.authorization;
      let userAlreadyFollowed = false;
      if (authHeader && authHeader.startsWith('Bearer ') && authHeader.split(' ')[1]) {
        const token = authHeader.split(' ')[1];
        const authorityInfo = await authorityRepository.getAuthority(token);
        const creatorFollowers = await userService.getUserFollowers(req.params.creatorId);
        if (creatorFollowers.find((follower) => follower.userId === authorityInfo.id)) {
          userAlreadyFollowed = true;
        }
        data.userAlreadyFollowed = userAlreadyFollowed;
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
  },
};

export default creatorController;
