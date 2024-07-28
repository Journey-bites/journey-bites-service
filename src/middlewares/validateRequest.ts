/* eslint-disable @typescript-eslint/no-explicit-any */
import { RequestHandler } from 'express';
import { AnyZodObject, ZodError } from 'zod';

import ErrorCode from '@/exceptions/ErrorCode';
import { createResponse } from '@/utils/http';

type FieldType = 'body' | 'params' | 'query' | 'file';

const validateRequest = (schema: AnyZodObject, type: FieldType = 'body'): RequestHandler => {
  return (req, res, next) => {
    try {
      req[type] = schema.parse(req[type]);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errorMessages: Record<string, string> = {};

        error.errors.forEach((err) => {
          const field = err.path.join('.');
          errorMessages[field] = err.message;
        });

        createResponse(res, {
          httpCode: 400,
          errorCode: ErrorCode.ILLEGAL_PAYLOAD,
          message: `Invalid field (${type})`,
          data: errorMessages,
        });
      } else {
        createResponse(res, {
          httpCode: 500,
          errorCode: ErrorCode.INTERNAL_SERVER_ERROR,
          message: 'Internal server error',
        });
      }
    }
  };
};

export default validateRequest;
