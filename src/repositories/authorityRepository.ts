import redisClient from '@/db/redisClient';

const PREFIX_KEY = 'session';
const EXPIRE_TIME = 60 * 60 * 24 * 7;

type AuthorityInfo = {
  id: string;
  email: string;
};

export const setAuthority = async (userId: string, authorityInfo: AuthorityInfo) => {
  await redisClient.set(`${PREFIX_KEY}:${userId}`, JSON.stringify(authorityInfo), 'EX', EXPIRE_TIME);

  return true;
};

export const getAuthority = async (userId: string) => {
  const authorityInfo = await redisClient.get(`${PREFIX_KEY}:${userId}`);

  return authorityInfo ? JSON.parse(authorityInfo) : null;
};

export const deleteAuthority = async (userId: string) => {
  const result = await redisClient.del(`${PREFIX_KEY}:${userId}`);

  return result;
};

const authorityRepository = {
  setAuthority,
  getAuthority,
  deleteAuthority,
};

export default authorityRepository;
