/* eslint-disable @typescript-eslint/no-unused-vars */
import { ErrorRequestHandler } from 'express';
import { HttpException } from '@/exceptions/HttpException';
import { createResponse } from '@/utils/http';
import ErrorCode from '@/exceptions/ErrorCode';

// must have 4 parameters to be recognized as an error handler
// eslint-disable-next-line no-unused-vars
const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  if (err instanceof Error) {
    if (err instanceof HttpException) {
      createResponse(res, {
        httpCode: err.httpCode,
        errorCode: err.errorCode,
        message: err.message,
        data: err.data,
      });
    }
    return;
  }

  createResponse(res, {
    httpCode: 500,
    errorCode: ErrorCode.INTERNAL_SERVER_ERROR,
    message: 'Internal Server Error',
  });
};

export default errorHandler;
