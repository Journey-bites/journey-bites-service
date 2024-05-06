import swaggerAutogen from 'swagger-autogen';

const HOST = process.env.HOST ?? 'localhost:3001';

const doc = {
  info: {
    title: 'Journey bites API',
    description: 'for the journey bites app',
  },
  host: HOST,
  basePath: '/api/v1',
  schemes: HOST.includes('localhost') ? ['http'] : ['https'],
  securityDefinitions: {
    Bearer: {
      type: 'apiKey',
      name: 'Authorization',
      in: 'header',
      description: 'JWT Authorization header using the Bearer scheme. Example: "Authorization: Bearer {token}"',
    },
  },
};

const outputFile = './swagger-output.json';
const routes = ['./src/routes/index.ts'];

/* NOTE: If you are using the express Router, you must pass in the 'routes' only the
root file where the route starts, such as index.js, app.js, routes.js, etc ... */

swaggerAutogen()(outputFile, routes, doc);
