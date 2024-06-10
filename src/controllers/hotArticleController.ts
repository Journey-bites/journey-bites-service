import { Request, Response, NextFunction } from 'express';

import { HttpException } from '@/exceptions/HttpException';
import hotArticleServices from '@/services/articleHotServices';
import { SystemException } from '@/exceptions/SystemException';
import { createResponse } from '@/utils/http';
import ErrorCode from '@/exceptions/ErrorCode';

interface RequestParams {}

interface ResponseBody {}

interface RequestBody {}

interface RequestQuery {
  count: string;
}

const hotArticleController = {
  getHotArticleInfo: async (
    req: Request<RequestParams, ResponseBody, RequestBody, RequestQuery>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { count } = req.query;

      const countNum = parseInt(count);
      if (count && isNaN(countNum)) {
        throw new HttpException({
          httpCode: 404,
          errorCode: ErrorCode.ILLEGAL_QUERY_STRING,
          message: 'Count must be a number.',
        });
      }

      const hotArticle = await hotArticleServices.findHotArticleByCount(countNum);

      return createResponse(res, {
        data: hotArticle,
      });
    } catch (error) {
      if (error instanceof HttpException) {
        next(error);
        return;
      }

      throw new SystemException('Error while getting hot article info');
    }
  },
};

export default hotArticleController;
