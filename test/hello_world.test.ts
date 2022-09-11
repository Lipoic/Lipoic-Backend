import { createServer } from '../src/util/server';
import request from 'supertest';

import type { Server } from 'http';
import type { Express } from 'express';

let server: { app: Express; server: Server };

beforeAll(() => {
  server = createServer();
});

it('Get / should return 200 & valid response', (done) => {
  request(server.app)
    .get(`/`)
    .expect('Content-Type', /json/)
    .expect(200)
    .end((err, res) => {
      if (err) return done(err);
      expect(res.body).toMatchObject({ message: 'Hello, World!' });
      done();
    });
});
