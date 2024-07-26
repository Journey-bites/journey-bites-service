import type { NextFunction, Request, Response } from 'express';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { randomUUID } from 'node:crypto';
import { r2 } from '@/lib/r2';
import { SystemException } from '@/exceptions/SystemException';
import { createResponse } from '@/utils/http';
import asyncHandler from '@/utils/asyncHandler';
import { R2_DEV_URL } from '@/constants';
import { FileRequestBody } from '@/validateSchema/fileRequest';
import { HttpException } from '@/exceptions/HttpException';
import ErrorCode from '@/exceptions/ErrorCode';

const bucket = process.env.R2_BUCKET;

interface UploadImageRequest extends Request {
  body: FileRequestBody;
}

const fileController = {
  uploadImageToR2: asyncHandler(async (req: UploadImageRequest, res: Response, next: NextFunction) => {
    const { file } = req.body;
    try {
      const key = randomUUID();
      const r2Client = r2();
      if (!r2Client) throw new Error('R2 environment variable is missing, please check the .env file.');

      const url = await getSignedUrl(r2Client, new PutObjectCommand({ Bucket: bucket, Key: key }));
      const uploadResponse = await fetch(url, {
        method: 'PUT',
        body: file,
        headers: {
          'Content-Type': file.type,
        },
      });
      if (!uploadResponse.ok) {
        throw new HttpException({
          httpCode: 500,
          errorCode: ErrorCode.BAD_REQUEST,
          message: 'Error while uploading image to R2',
        });
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
