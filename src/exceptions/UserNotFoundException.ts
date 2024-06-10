import ErrorCode from './ErrorCode';
import { HttpException } from './HttpException';

export class UserNotFoundException extends HttpException {
  constructor(message = 'User not found') {
    super({
      httpCode: 404,
      errorCode: ErrorCode.USER_NOT_FOUND,
      message,
    });
  }
}
