import supertest from 'supertest';

import app, { startServer, closeServer } from '../app';

const request = supertest(app);

describe('GET /', () => {
  beforeAll(startServer);
  afterAll(closeServer);

  it('responds with json', (done) => {
    request.get('/api/v1').set('Accept', 'application/json').expect('Content-Type', /json/).expect(
      200,
      {
        statusCode: 0,
        message: 'Hello World!',
        data: null,
      },
      done
    );
  });
});
