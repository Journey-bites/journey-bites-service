import ErrorCode from './ErrorCode';
import { HttpException } from './HttpException';

export class ResourceNotFoundException extends HttpException {
  constructor(message = 'Resource not found') {
    super({
      httpCode: 404,
      errorCode: ErrorCode.RESOURCE_NOT_FOUND,
      message,
    });
  }
}
