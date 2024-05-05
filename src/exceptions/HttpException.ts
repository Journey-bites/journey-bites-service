import ErrorCode from './ErrorCode';

export interface HttpErrorArgs<T> {
  httpCode: number;
  errorCode: ErrorCode;
  message: string;
  data?: T;
}

export class HttpException extends Error {
  public httpCode: number;
  public errorCode: ErrorCode;
  public data: unknown;

  constructor({ httpCode, errorCode, message, data = null }: HttpErrorArgs<unknown>) {
    super(message);
    this.httpCode = httpCode;
    this.errorCode = errorCode;
    this.data = data;
  }
}
