import { RequestHandler } from 'express';

import ErrorCode from '@/exceptions/ErrorCode';
import { HttpException } from '@/exceptions/HttpException';
import { UserNotFoundException } from '@/exceptions/UserNotFoundException';
import { SystemException } from '@/exceptions/SystemException';
import userService from '@/services/userService';
import { createResponse } from '@/utils/http';

type Method = 'getUserInfo' | 'updateUserProfile' | 'getUserFollowers' | 'followUser' | 'unfollowUser';
type UserController = Record<Method, RequestHandler>;

const userController: UserController = {
  getUserInfo: async (req, res, next) => {
    try {
      const user = await userService.findUserById(req.user.id);

      if (!user) {
        throw new UserNotFoundException();
      }

      const { email, emailVerified, profile, billing } = user;

      return createResponse(res, {
        data: {
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
  },
  updateUserProfile: async (req, res, next) => {
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
  },
  getUserFollowers: async (req, res, next) => {
    try {
      const followers = await userService.getUserFollowers(req.user.id);

      const data = followers.map(({ follower }) => ({
        userId: follower.id,
        email: follower.email,
        ...follower.profile,
      }));

      return createResponse(res, {
        data,
      });
    } catch (error) {
      if (error instanceof HttpException) {
        next(error);
        return;
      }

      throw new SystemException('Error while getting user followers');
    }
  },
  followUser: async (req, res, next) => {
    const followerUserId = req.user.id;
    const followingUserId = req.params.userId;

    if (followerUserId === followingUserId) {
      return createResponse(res, {
        httpCode: 400,
        errorCode: ErrorCode.ILLEGAL_PATH_PARAMETER,
        message: 'You cannot follow yourself',
      });
    }

    try {
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
  },
  unfollowUser: async (req, res, next) => {
    const followerUserId = req.user.id;
    const followingUserId = req.params.userId;

    if (followerUserId === followingUserId) {
      return createResponse(res, {
        httpCode: 400,
        errorCode: ErrorCode.ILLEGAL_PATH_PARAMETER,
        message: 'You cannot unfollow yourself',
      });
    }

    try {
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
  },
};

export default userController;
