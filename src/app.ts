/* eslint-disable no-console */
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import corsOptions from '@/config/corsOptions';
import '@/config/passport';
import router from '@/routes';
import '@/db';
import errorHandler from '@/middlewares/errorHandler';
import { RouteNotFoundException } from '@/exceptions/RouteNotFoundException';

const PORT = process.env.PORT ?? 3001;

const app = express();

app.use(cors(corsOptions));

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());

app.use('/api/v1', router);

app.use((_, __, next) => {
  const err = new RouteNotFoundException();
  next(err);
});
app.use(errorHandler);

const server = app.listen(PORT, () => console.log(`Server is running on http://localhost:${PORT}`));

export default server;
