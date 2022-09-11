import { createServer } from '@/util/server';
import request from 'supertest';
import { Express } from 'express-serve-static-core';

let server: Express;

beforeAll(() => {
  server = createServer();
});

it('Get / should return 200 & valid response', (done) => {
  request(server)
    .get(`/`)
    .expect('Content-Type', /json/)
    .expect(200)
    .end((err, res) => {
      if (err) return done(err);
      expect(res.body).toMatchObject({ message: 'Hello, World!' });
      done();
    });
});
