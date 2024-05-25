import crypto from 'crypto';

export const generateToken = (size = 24) => {
  return crypto.randomBytes(size).toString('hex');
};
