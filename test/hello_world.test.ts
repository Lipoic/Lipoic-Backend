import { createServer } from '@/util/server';
import request from 'supertest';
import { Express } from 'express-serve-static-core';
import { test, expect, beforeAll } from 'vitest';

let server: Express;

beforeAll(() => {
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
