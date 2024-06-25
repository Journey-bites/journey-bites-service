import { RequestHandler } from 'express';

import { HttpException } from '@/exceptions/HttpException';
import { PermissionDeniedException } from '@/exceptions/PermissionDeniedException';
import authorityRepository from '@/repositories/authorityRepository';
import { isValidObjectId } from '@/utils/dbHelper';

const generateAuthenticate: (isOptional?: boolean) => RequestHandler =
  (isOptional = false) =>
  async (req, res, next) => {
    const authHeader = req.headers.authorization;

    try {
      if (!authHeader || !authHeader.startsWith('Bearer ') || !authHeader.split(' ')[1]) {
        if (isOptional) {
          return next();
        }
        throw new PermissionDeniedException('Token is required');
      }

      const token = authHeader.split(' ')[1];

      const authorityInfo = await authorityRepository.getAuthority(token);

      if (!authorityInfo) {
        throw new PermissionDeniedException('Token is invalid');
      }

      if (!isValidObjectId(authorityInfo.id)) {
        authorityRepository.deleteAuthority(token);
        throw new PermissionDeniedException('Authority ID is invalid');
      }

      req.user = {
        id: authorityInfo.id,
        email: authorityInfo.email,
        token,
      };

      next();
    } catch (error) {
      if (error instanceof HttpException) {
        return next(error);
      }

      return next(new PermissionDeniedException());
    }
  };

export const authenticate = generateAuthenticate();
export const authenticateOptional = generateAuthenticate(true);

export default authenticate;
