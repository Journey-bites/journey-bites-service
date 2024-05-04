import 'dotenv/config';
import express from 'express';

import router from '@/routes';

const PORT = process.env.PORT ?? 3001;

const app = express();

app.use('/api/v1', router);

app.listen(PORT, () => console.log(`Server is running on http://localhost:${PORT}`));

export default app;
