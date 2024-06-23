import ErrorCode from './ErrorCode';
import { HttpException } from './HttpException';

export class InvalidIdException extends HttpException {
  constructor(message = 'Invalid Id') {
    super({
      httpCode: 401,
      errorCode: ErrorCode.INVALID_ID,
      message,
    });
  }
}
