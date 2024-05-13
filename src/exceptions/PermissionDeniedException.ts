import ErrorCode from './ErrorCode';
import { HttpException } from './HttpException';

export class PermissionDeniedException extends HttpException {
  constructor(message = 'Permission denied') {
    super({
      httpCode: 401,
      errorCode: ErrorCode.USER_NOT_AUTHORIZED,
      message,
    });
  }
}
