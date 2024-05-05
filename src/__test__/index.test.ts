import supertest from 'supertest';

import server from '../app';

const request = supertest(server);

describe('GET /', () => {
  afterAll((done) => {
    server.close(done);
  });

  it('responds with json', (done) => {
    request.get('/api/v1').set('Accept', 'application/json').expect('Content-Type', /json/).expect(
      200,
      {
        errorCode: 0,
        message: 'Hello World!',
        data: null,
      },
      done
    );
  });
});
