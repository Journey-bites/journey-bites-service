/* eslint-disable no-console */
import 'dotenv/config';
import express from 'express';

import router from '@/routes';
import '@/db';

const PORT = process.env.PORT ?? 3001;

const app = express();

app.use('/api/v1', router);

const server = app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

export default server;
