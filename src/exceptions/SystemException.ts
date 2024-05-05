import ErrorCode from './ErrorCode';
import { HttpException } from './HttpException';

export class SystemException extends HttpException {
  constructor(message = 'Internal System Error') {
    super({
      httpCode: 500,
      errorCode: ErrorCode.INTERNAL_SERVER_ERROR,
      message,
    });
  }
}
