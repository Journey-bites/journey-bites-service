/* eslint-disable @typescript-eslint/no-explicit-any */
import jwt from 'jsonwebtoken';

const TOKEN_SECRET = process.env.TOKEN_SECRET;
const TOKEN_EXPIRATION = process.env.TOKEN_EXPIRATION;

export const generateToken = (payload: Record<string, any>) => {
  return jwt.sign(payload, TOKEN_SECRET, { expiresIn: TOKEN_EXPIRATION });
};

export const verifyToken = <
  T = {
    userId: string;
    email: string;
  },
>(
  token: string
): T | null => {
  try {
    const decoded = jwt.verify(token, TOKEN_SECRET) as T;
    return decoded;
  } catch (error: unknown) {
    return null;
  }
};
