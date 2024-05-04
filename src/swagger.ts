import swaggerAutogen from 'swagger-autogen';

const PORT = process.env.PORT ?? 3001;

const doc = {
  info: {
    title: 'My API',
    description: 'Description',
  },
  host: `localhost:${PORT}/api/v1`,
};

const outputFile = './swagger-output.json';
const routes = ['./src/routes/index.ts'];

/* NOTE: If you are using the express Router, you must pass in the 'routes' only the
root file where the route starts, such as index.js, app.js, routes.js, etc ... */

swaggerAutogen()(outputFile, routes, doc);
