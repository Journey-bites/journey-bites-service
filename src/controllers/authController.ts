import { Request, Response, NextFunction } from 'express';

import userService from '@/services/userService';
import ErrorCode from '@/exceptions/ErrorCode';
import { SystemException } from '@/exceptions/SystemException';
import { HttpException } from '@/exceptions/HttpException';
import { createResponse } from '@/utils/http';
import { hashPassword, comparePassword } from '@/utils/encryptionHelper';
import { generateToken } from '@/utils/tokenHelper';
import authorityRepository from '@/repositories/authorityRepository';

type RegisterRequest = Request & {
  body: {
    email: string;
    password: string;
    displayName: string;
  };
};

type LoginRequest = Request & {
  body: {
    email: string;
    password: string;
  };
};

type VerifyEmailRequest = Request & {
  body: {
    email: string;
  };
};

type ResetPasswordRequest = Request & {
  body: {
    password: string;
  };
};

const authController = {
  register: async (req: RegisterRequest, res: Response, next: NextFunction) => {
    try {
      const { email, password, displayName } = req.body;
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
  },
  login: async (req: LoginRequest, res: Response, next: NextFunction) => {
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
  },
  verifyEmail: async (req: VerifyEmailRequest, res: Response, next: NextFunction) => {
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
  },
  logout: async (req: Request, res: Response, next: NextFunction) => {
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
  },
  resetPassword: async (req: ResetPasswordRequest, res: Response, next: NextFunction) => {
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
  },
  authorizationCallback: async (req: Request, res: Response, next: NextFunction) => {
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
  },
};

export default authController;
