import { RequestHandler } from 'express';

import { HttpException } from '@/exceptions/HttpException';
import ErrorCode from '@/exceptions/ErrorCode';
import userService from '@/services/userService';
import { UserNotFoundException } from '@/exceptions/UserNotFoundException';
import { SystemException } from '@/exceptions/SystemException';
import { createResponse } from '@/utils/http';

type Method = 'getUserInfo' | 'updateUserProfile' | 'getUserFollowers' | 'followUser';
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

    try {
      const followingUser = await userService.findUserById(followingUserId);

      if (!followingUser) {
        throw new UserNotFoundException();
      }

      await userService.followUser(followerUserId, followingUserId);

      return createResponse(res, {
        httpCode: 201,
        message: 'User followed successfully',
      });
    } catch (error) {
      if (error instanceof HttpException) {
        next(error);
        return;
      }
      throw new SystemException('Error while following user');
    }
  },
};

export default userController;
