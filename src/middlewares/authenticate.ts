import { Request, Response, NextFunction } from 'express';

import { HttpException } from '@/exceptions/HttpException';
import { PermissionDeniedException } from '@/exceptions/PermissionDeniedException';
import { verifyToken } from '@/utils/tokenHelper';

const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  try {
    if (!authHeader || !authHeader.startsWith('Bearer ') || !authHeader.split(' ')[1]) {
      throw new PermissionDeniedException('Token is required');
    }

    const token = authHeader.split(' ')[1];

    const jwtDecoded = verifyToken(token);

    if (!jwtDecoded) {
      throw new PermissionDeniedException('Invalid token');
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

    return next(new PermissionDeniedException());
  }
};

export default authenticate;
