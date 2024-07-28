import { S3Client } from '@aws-sdk/client-s3';

const r2 = () => {
  if (!process.env.R2_ENDPOINT || !process.env.R2_ACCESS_KEY_ID || !process.env.R2_SECRET_ACCESS_KEY) {
    // eslint-disable-next-line no-console
    console.log('R2 environment variable is missing, please check the .env file.');
    return null;
  }
  return new S3Client({
    region: 'auto',
    endpoint: process.env.R2_ENDPOINT,
    credentials: {
      accessKeyId: process.env.R2_ACCESS_KEY_ID,
      secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
    },
  });
};

export const R2Client = r2();
