import { Request, Response, NextFunction } from 'express';

import ErrorCode from '@/exceptions/ErrorCode';
import { HttpException } from '@/exceptions/HttpException';
import { UserNotFoundException } from '@/exceptions/UserNotFoundException';
import { SystemException } from '@/exceptions/SystemException';
import userService from '@/services/userService';
import { UpdateUserRequest } from '@/validateSchema/updateUserRequest';
import { createResponse } from '@/utils/http';
import asyncHandler from '@/utils/asyncHandler';
import articleServices from '@/services/articleServices';

type UpdateUserProfileRequest = Request & {
  body: UpdateUserRequest;
};

type FollowUserRequest = Request & {
  params: {
    userId: string;
  };
};

type UnfollowUserRequest = Request & {
  params: {
    userId: string;
  };
};

const userController = {
  getUserInfo: asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await userService.findUserById(req.user.id);

      if (!user) {
        throw new UserNotFoundException();
      }

      const { email, emailVerified, profile, billing } = user;

      return createResponse(res, {
        data: {
          id: req.user.id,
          email,
          emailVerified,
          profile,
          billing,
        },
      });
    } catch (error) {
      if (error instanceof HttpException) {
        next(error);
        return;
      }

      throw new SystemException('Error while getting user info');
    }
  }),
  updateUserProfile: asyncHandler(async (req: UpdateUserProfileRequest, res: Response, next: NextFunction) => {
    try {
      await userService.updateUserProfile(req.user.id, req.body);

      return createResponse(res, {
        httpCode: 201,
        message: 'User profile updated successfully',
      });
    } catch (error) {
      if (error instanceof HttpException) {
        next(error);
        return;
      }

      throw new SystemException('Error while updating user profile');
    }
  }),
  getUserFollowers: asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    try {
      const followers = await userService.getUserFollowers(req.user.id);

      return createResponse(res, {
        data: followers,
      });
    } catch (error) {
      if (error instanceof HttpException) {
        next(error);
        return;
      }

      throw new SystemException('Error while getting user followers');
    }
  }),
  getUserFollowings: asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    try {
      const followings = await userService.getUserFollowings(req.user.id);

      return createResponse(res, {
        data: followings,
      });
    } catch (error) {
      if (error instanceof HttpException) {
        next(error);
        return;
      }

      throw new SystemException('Error while getting user followings');
    }
  }),
  followUser: asyncHandler(async (req: FollowUserRequest, res: Response, next: NextFunction) => {
    const followerUserId = req.user.id;
    const followingUserId = req.params.userId;

    try {
      if (followerUserId === followingUserId) {
        throw new HttpException({
          httpCode: 400,
          errorCode: ErrorCode.ILLEGAL_PATH_PARAMETER,
          message: 'You cannot follow yourself',
        });
      }

      const followingUser = await userService.findUserById(followingUserId);

      if (!followingUser) {
        throw new UserNotFoundException();
      }

      await userService.followUser(followerUserId, followingUserId);

      return createResponse(res, { httpCode: 204 });
    } catch (error) {
      if (error instanceof HttpException) {
        next(error);
        return;
      }
      throw new SystemException('Error while following user');
    }
  }),
  unfollowUser: asyncHandler(async (req: UnfollowUserRequest, res: Response, next: NextFunction) => {
    const followerUserId = req.user.id;
    const followingUserId = req.params.userId;

    try {
      if (followerUserId === followingUserId) {
        throw new HttpException({
          httpCode: 400,
          errorCode: ErrorCode.ILLEGAL_PATH_PARAMETER,
          message: 'You cannot unfollow yourself',
        });
      }

      const followingUser = await userService.findUserById(followingUserId);

      if (!followingUser) {
        throw new UserNotFoundException();
      }

      await userService.unfollowUser(followerUserId, followingUserId);

      return createResponse(res, { httpCode: 204 });
    } catch (error) {
      if (error instanceof HttpException) {
        next(error);
        return;
      }
      throw new SystemException('Error while unfollowing user');
    }
  }),
  getUserArticles: asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    try {
      const articles = await articleServices.getArticlesByCreatorId(req.user.id);

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

      throw new SystemException('Error while getting user articles');
    }
  }),
};

export default userController;
