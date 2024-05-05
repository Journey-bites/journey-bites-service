import ErrorCode from './ErrorCode';
import { HttpException } from './HttpException';

export class NotFoundException extends HttpException {
  constructor(message = 'Route Not Found') {
    super({
      httpCode: 404,
      errorCode: ErrorCode.ROUTE_NOT_FOUND,
      message,
    });
  }
}
