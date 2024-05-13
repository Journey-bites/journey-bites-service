import { Response } from 'express';
import ErrorCode from '@/exceptions/ErrorCode';
import { BaseResponse } from '@/types/comm';

type ResponseBody<T> = {
  httpCode?: number;
  errorCode?: ErrorCode;
  message?: string;
  data?: T;
};

export const createResponse = <T>(
  res: Response,
  { httpCode = 200, errorCode = ErrorCode.NORMAL, message = 'success', data }: ResponseBody<T>
) => {
  let response: BaseResponse<T>;

  if (!data) {
    response = {
      statusCode: errorCode,
      message,
    };
  } else {
    response = {
      statusCode: errorCode,
      message,
      data,
    };
  }

  return res.status(httpCode).json(response);
};
