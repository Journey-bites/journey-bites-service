import { NextFunction, Request, Response } from 'express';

import { HttpException } from '@/exceptions/HttpException';
import articleHotServices from '@/services/articleHotServices';
import { SystemException } from '@/exceptions/SystemException';
import { createResponse } from '@/utils/http';

const userController = {
  getArticleHotInfo: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parmCount = req.query.count as string;
      const count = parseInt(parmCount);

      const articleHot = await articleHotServices.findArticleHotByCount(count);

      return createResponse(res, {
        data: articleHot,
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
