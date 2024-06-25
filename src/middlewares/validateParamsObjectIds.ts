import { RequestHandler } from 'express';

import ErrorCode from '@/exceptions/ErrorCode';
import { isValidObjectId } from '@/utils/dbHelper';
import { createResponse } from '@/utils/http';

const validateParamsObjectIds =
  (params: string[]): RequestHandler =>
  (req, res, next) => {
    for (const param of params) {
      if (!isValidObjectId(req.params[param])) {
        createResponse(res, {
          httpCode: 400,
          errorCode: ErrorCode.INVALID_ID,
          message: `Invalid param: ${param}`,
        });
        return;
      }
    }

    next();
  };

export default validateParamsObjectIds;
