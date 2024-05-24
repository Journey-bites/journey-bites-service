import { RequestHandler } from 'express';

import { HttpException } from '@/exceptions/HttpException';
import { PermissionDeniedException } from '@/exceptions/PermissionDeniedException';
import authorityRepository from '@/repositories/authorityRepository';

const authenticate: RequestHandler = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  try {
    if (!authHeader || !authHeader.startsWith('Bearer ') || !authHeader.split(' ')[1]) {
      throw new PermissionDeniedException('Token is required');
    }

    const token = authHeader.split(' ')[1];

    const authorityInfo = await authorityRepository.getAuthority(token);

    if (!authorityInfo) {
      throw new PermissionDeniedException('Token is invalid');
    }

    req.user = {
      id: authorityInfo.id,
      email: authorityInfo.email,
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
