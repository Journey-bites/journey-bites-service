import { CorsOptions } from 'cors';

const corsOptions: CorsOptions = {
  origin: [
    'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:3005',
    'https://journey-bites.zeabur.app',
    'https://journey-bites-dev.zeabur.app',
    'https://api-journey-bites.zeabur.app',
    'https://dev-api-journey-bites.zeabur.app',
  ],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Content-Type'],
  credentials: true,
  maxAge: 86400,
  preflightContinue: false,
  optionsSuccessStatus: 204,
};

export default corsOptions;
