import { RequestHandler } from 'express';

import userService from '@/services/userService';
import ErrorCode from '@/exceptions/ErrorCode';
import { SystemException } from '@/exceptions/SystemException';
import { HttpException } from '@/exceptions/HttpException';
import { createResponse } from '@/utils/http';
import { hashPassword, comparePassword } from '@/utils/encryptionHelper';
import { generateToken } from '@/utils/tokenHelper';

type Method = 'register' | 'login' | 'verifyEmail';
type AuthController = Record<Method, RequestHandler>;

const authController: AuthController = {
  register: async (req, res, next) => {
    try {
      const { email, password } = req.body;

      const foundUser = await userService.findUserByEmail(email);

      if (foundUser) {
        throw new HttpException({
          httpCode: 400,
          errorCode: ErrorCode.USER_ALREADY_EXISTS,
          message: 'User already exists',
        });
      }

      const hashedPassword = await hashPassword(password);
      await userService.createUser(email, hashedPassword);

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
  login: async (req, res, next) => {
    try {
      const { email, password } = req.body;

      const user = await userService.findUserByEmail(email);

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

      const jwtPayload = { id: user.id, email };
      const accessToken = generateToken(jwtPayload);

      return createResponse(res, {
        message: 'Login successful',
        data: {
          token: accessToken,
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
  verifyEmail: async (req, res, next) => {
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
};

export default authController;
