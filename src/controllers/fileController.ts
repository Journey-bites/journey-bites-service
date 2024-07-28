import type { NextFunction, Request, Response } from 'express';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { randomUUID } from 'node:crypto';
import { R2Client } from '@/lib/r2';
import { SystemException } from '@/exceptions/SystemException';
import { createResponse } from '@/utils/http';
import asyncHandler from '@/utils/asyncHandler';
import { R2_DEV_URL } from '@/constants';
import { HttpException } from '@/exceptions/HttpException';
import ErrorCode from '@/exceptions/ErrorCode';

const bucket = process.env.R2_BUCKET;

const fileController = {
  uploadImageToR2: asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    try {
      const key = randomUUID();
      const file = req.file;
      if (!file)
        throw new HttpException({
          httpCode: 400,
          errorCode: ErrorCode.ILLEGAL_FORM_DATA,
          message: 'File is required',
        });
      if (!R2Client) throw new Error('R2 environment variable is missing, please check the .env file.');
      const url = await getSignedUrl(R2Client, new PutObjectCommand({ Bucket: bucket, Key: key }));

      const uploadResponse = await fetch(url, {
        method: 'PUT',
        body: file.buffer,
        headers: {
          'Content-Type': file.mimetype,
        },
      });
      if (!uploadResponse.ok) {
        throw new SystemException('Error while uploading image to R2');
      }

      return createResponse(res, {
        data: {
          url: `${R2_DEV_URL}/${key}`,
        },
      });
    } catch (error) {
      if (error instanceof HttpException) {
        next(error);
        return;
      }
      throw new SystemException('Error while getting pre-signed URL');
    }
  }),
};

export default fileController;
