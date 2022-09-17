import { createServer } from '@/util/server';
import request from 'supertest';
import { Express } from 'express-serve-static-core';
import { test, expect, beforeAll } from 'vitest';
import { init } from '@/util/init';

let server: Express;

beforeAll(() => {
  init();
  server = createServer();
});

test('Get / should return 200 & valid response', async () => {
  request(server)
    .get(`/`)
    .expect('Content-Type', /json/)
    .expect(200)
    .end((err, res) => {
      if (err) return;
      expect(res.body).toMatchObject({ message: 'Hello, World!' });
    });
});
