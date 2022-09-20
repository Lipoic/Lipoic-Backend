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
  const response = await request(server).get(`/`);

  expect(response.headers['content-type']).toBe(
    'application/json; charset=utf-8'
  );
  expect(response.status).toBe(200);
  expect(response.body).toMatchObject({
    code: 200,
    message: 'OK',
    data: {
      message: 'Hello, World!',
    },
  });
});
