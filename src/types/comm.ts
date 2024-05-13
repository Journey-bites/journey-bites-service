export type Meta = {
  page: number;
  totalPage: number;
  totalData: number;
  pageSize: number;
};

export type BaseResponse<T> = {
  statusCode: number;
  message: string;
  data?: T;
  meta?: Meta;
};
