import { Request, Response, NextFunction } from 'express';

import { HttpException } from '@/exceptions/HttpException';
import articleHotServices from '@/services/articleHotServices';
import { SystemException } from '@/exceptions/SystemException';
import { createResponse } from '@/utils/http';

interface RequestParams {}

interface ResponseBody {}

interface RequestBody {}

interface RequestQuery {
  count: string;
}

const userController = {
  getArticleHotInfo: async (
    req: Request<RequestParams, ResponseBody, RequestBody, RequestQuery>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { count } = req.query;

      const countNum = parseInt(count);

      const articleHot = await articleHotServices.findArticleHotByCount(countNum);

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
