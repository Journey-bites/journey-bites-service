/* eslint-disable no-console */
import Redis from 'ioredis';

const redisClient = new Redis(process.env.REDIS_URI);

redisClient.on('connect', () => console.log('Redis client connected'));
redisClient.on('error', (err) => console.error('Redis error', err));

export default redisClient;
