import { CorsOptions } from 'cors';

const allowedOrigins = [
  'http://127.0.0.1:3005',
  'http://localhost:3005',
  'https://journey-bites.zeabur.app',
  'https://api-journey-bites.zeabur.app',
  'https://dev-api-journey-bites.zeabur.app',
];

const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Content-Type'],
  credentials: true,
  maxAge: 86400,
  preflightContinue: false,
  optionsSuccessStatus: 204,
};

export default corsOptions;
