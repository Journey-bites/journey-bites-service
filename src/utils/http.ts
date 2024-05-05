import { Response } from 'express';
import ErrorCode from '@/exceptions/ErrorCode';
import { BaseResponse } from '@/types/comm';

type ResponseBody<T> = {
  httpCode?: number;
} & Partial<BaseResponse<T>>;

export const createResponse = <T>(
  res: Response,
  { httpCode = 200, errorCode = ErrorCode.NORMAL, message = 'success', data = null }: ResponseBody<T>
) => {
  return res.status(httpCode).json({
    errorCode,
    message,
    data,
  } satisfies BaseResponse<T>);
};
