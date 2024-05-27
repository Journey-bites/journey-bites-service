import { RequestHandler } from 'express';

import { HttpException } from '@/exceptions/HttpException';
import ErrorCode from '@/exceptions/ErrorCode';
import userService from '@/services/userService';
import { SystemException } from '@/exceptions/SystemException';
import { createResponse } from '@/utils/http';

type Method = 'getUserInfo' | 'updateUserProfile';
type UserController = Record<Method, RequestHandler>;

const userController: UserController = {
  getUserInfo: async (req, res, next) => {
    try {
      const user = await userService.findUserById(req.user.id);

      if (!user) {
        throw new HttpException({
          httpCode: 404,
          errorCode: ErrorCode.USER_NOT_FOUND,
          message: 'User not found',
        });
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
};

export default userController;
