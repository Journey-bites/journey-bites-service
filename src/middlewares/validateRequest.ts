/* eslint-disable @typescript-eslint/no-explicit-any */
import { RequestHandler } from 'express';
import { z, ZodError } from 'zod';

import { createResponse } from '@/utils/http';
import ErrorCode from '@/exceptions/ErrorCode';

interface ValidationRequestSchema {
  body?: z.AnyZodObject;
  params?: z.AnyZodObject;
  query?: z.AnyZodObject;
}

const validateRequest = (schema: ValidationRequestSchema): RequestHandler => {
  return async (req, res, next) => {
    let rootCause = '';
    try {
      if (schema.body) {
        rootCause = 'body';
        schema.body.parse(req.body);
      }
      if (schema.params) {
        rootCause = 'params';
        schema.params.parse(req.params);
      }
      if (schema.query) {
        rootCause = 'query';
        schema.query.parse(req.query);
      }
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
          message: `Invalid field (${rootCause})`,
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
