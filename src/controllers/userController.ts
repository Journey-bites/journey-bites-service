import { Request, Response, NextFunction } from 'express';

import { HttpException } from '@/exceptions/HttpException';
import ErrorCode from '@/exceptions/ErrorCode';
import userService from '@/services/userService';
import { SystemException } from '@/exceptions/SystemException';
import { createResponse } from '@/utils/http';

const userController = {
  getUserInfo: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await userService.findUserById(req.user.id);

      if (!user) {
        throw new HttpException({
          httpCode: 404,
          errorCode: ErrorCode.USER_NOT_FOUND,
          message: 'User not found',
        });
      }

      const { email, emailVerified, profile, oAuthProvider, billing } = user;

      return createResponse(res, {
        data: {
          email,
          emailVerified,
          profile,
          oAuthProvider,
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
};

export default userController;
