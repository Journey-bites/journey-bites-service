import { Request, Response, NextFunction } from 'express';

import { HttpException } from '@/exceptions/HttpException';
import ErrorCode from '@/exceptions/ErrorCode';
import { verifyToken } from '@/utils/tokenHelper';

const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  try {
    if (!authHeader || !authHeader.startsWith('Bearer ') || !authHeader.split(' ')[1]) {
      throw new HttpException({
        httpCode: 401,
        errorCode: ErrorCode.USER_NOT_AUTHORIZED,
        message: 'Token is required',
      });
    }

    const token = authHeader.split(' ')[1];

    const jwtDecoded = verifyToken(token);

    if (!jwtDecoded) {
      throw new HttpException({
        httpCode: 401,
        errorCode: ErrorCode.USER_NOT_AUTHORIZED,
        message: 'Invalid token',
      });
    }

    req.user = {
      id: jwtDecoded.id,
      email: jwtDecoded.email,
    };

    next();
  } catch (error) {
    if (error instanceof HttpException) {
      return next(error);
    }

    return next(
      new HttpException({
        httpCode: 401,
        errorCode: ErrorCode.USER_NOT_AUTHORIZED,
        message: 'Permission denied',
      })
    );
  }
};

export default authenticate;
