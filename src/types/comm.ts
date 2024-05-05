export type BaseResponse<T = null> = {
  errorCode: number;
  message: string;
  data: T | null;
};
