/* eslint-disable no-console */
import { type Server } from 'http';
import 'dotenv/config';
import express from 'express';

import router from '@/routes';

const PORT = process.env.PORT ?? 3001;

const app = express();
let server: Server;

const startServer = () => {
  server = app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
};

const closeServer = (done: () => void) => {
  if (server) {
    server.close(() => {
      console.log('Server closed');
      done();
    });
  }
};

app.use('/api/v1', router);

if (require.main === module) {
  startServer();
}

export { startServer, closeServer };
export default app;
