import { Request, Response, NextFunction } from 'express';

import ErrorCode from '@/exceptions/ErrorCode';
import { SystemException } from '@/exceptions/SystemException';
import { HttpException } from '@/exceptions/HttpException';
import userService from '@/services/userService';
import authorityRepository from '@/repositories/authorityRepository';
import asyncHandler from '@/utils/asyncHandler';
import { hashPassword, comparePassword } from '@/utils/encryptionHelper';
import { createResponse } from '@/utils/http';
import { generateToken } from '@/utils/tokenHelper';

interface RegisterRequest extends Request {
  body: {
    email: string;
    password: string;
    displayName: string;
  };
}

interface LoginRequest extends Request {
  body: {
    email: string;
    password: string;
  };
}

interface VerifyEmailRequest extends Request {
  body: {
    email: string;
  };
}

interface ResetPasswordRequest extends Request {
  body: {
    password: string;
  };
}

const authController = {
  register: asyncHandler(async (req: RegisterRequest, res: Response, next: NextFunction) => {
    const { email, password, displayName } = req.body;

    try {
      const foundUser = await userService.findUserByEmail(email);

      if (foundUser) {
        throw new HttpException({
          httpCode: 400,
          errorCode: ErrorCode.USER_ALREADY_EXISTS,
          message: 'User already exists',
        });
      }

      const hashedPassword = await hashPassword(password);
      await userService.createUser(email, hashedPassword, { displayName });

      return createResponse(res, {
        httpCode: 201,
        message: 'User registered successfully',
      });
    } catch (error) {
      if (error instanceof HttpException) {
        next(error);
        return;
      }
      next(new SystemException('Error while registering new user'));
    }
  }),
  login: asyncHandler(async (req: LoginRequest, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body;

      const user = await userService.findUserByEmail(email, true);

      if (!user) {
        throw new HttpException({
          httpCode: 401,
          errorCode: ErrorCode.USER_NOT_FOUND,
          message: 'User not found or wrong password',
        });
      }

      const isPasswordMatch = await comparePassword(password, user.password);

      if (!isPasswordMatch) {
        throw new HttpException({
          httpCode: 401,
          errorCode: ErrorCode.USER_PASSWORD_NOT_MATCH,
          message: 'User not found or wrong password',
        });
      }

      const userPayload = { id: user.id, email };
      const userToken = generateToken();

      await authorityRepository.setAuthority(userToken, userPayload);

      return createResponse(res, {
        message: 'Login successful',
        data: {
          token: userToken,
        },
      });
    } catch (error) {
      if (error instanceof HttpException) {
        next(error);
        return;
      }
      next(new SystemException('Error while logging in'));
    }
  }),
  verifyEmail: asyncHandler(async (req: VerifyEmailRequest, res: Response, next: NextFunction) => {
    try {
      const { email } = req.body;

      const foundUser = await userService.findUserByEmail(email);

      if (foundUser) {
        throw new HttpException({
          httpCode: 400,
          errorCode: ErrorCode.USER_ALREADY_EXISTS,
          message: 'User already exists',
        });
      }

      return createResponse(res, {
        message: 'Email is available',
      });
    } catch (error) {
      if (error instanceof HttpException) {
        next(error);
        return;
      }
      next(new SystemException('Error while verifying email'));
    }
  }),
  logout: asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    try {
      await authorityRepository.deleteAuthority(req.user.token);

      return createResponse(res, { httpCode: 204 });
    } catch (error) {
      if (error instanceof HttpException) {
        next(error);
        return;
      }
      next(new SystemException('Error while logging out'));
    }
  }),
  resetPassword: asyncHandler(async (req: ResetPasswordRequest, res: Response, next: NextFunction) => {
    try {
      const { password } = req.body;
      const userId = req.user.id;

      const hashedPassword = await hashPassword(password);
      await userService.updateUserPassword(userId, hashedPassword);

      return createResponse(res, {
        message: 'Password updated successfully',
      });
    } catch (error) {
      if (error instanceof HttpException) {
        next(error);
        return;
      }
      next(new SystemException('Error while resetting password'));
    }
  }),
  authorizationCallback: asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        throw new Error('loginCallback error!');
      }

      const { id, email } = req.user;

      const userPayload = { id, email };
      const userToken = generateToken();

      await authorityRepository.setAuthority(userToken, userPayload);

      const params = new URLSearchParams({ token: userToken }).toString();

      res.redirect(`${process.env.CLIENT_URL}/login?${params}`);
    } catch (error) {
      if (error instanceof HttpException) {
        next(error);
        return;
      }
      next(new SystemException('Error while oauth logging in'));
    }
  }),
};

export default authController;
