import supertest from 'supertest';

import server from '../app';
import mongo from '@/db/mongo';

const request = supertest(server);

describe('GET /', () => {
  beforeAll(async () => {
    await mongo.connectDB();
  });

  afterAll((done) => {
    server.close(async () => {
      await mongo.disconnectDB();
      done();
    });
  });

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
