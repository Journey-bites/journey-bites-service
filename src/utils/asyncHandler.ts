/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response, NextFunction } from 'express';

interface RequestHandler<T extends Request = Request> {
  (req: T, res: Response, next: NextFunction): any;
}

const asyncHandler = <T extends Request = Request>(fn: RequestHandler<T>): RequestHandler<T> => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

export default asyncHandler;
