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

test('Hello world', async () => {
  const response = await request(server).get(`/`);

  expect(response.headers['content-type']).toBe(
    'application/json; charset=utf-8'
  );
  expect(response.status).toBe(200);
  expect(response.body).toMatchObject({
    data: { message: 'Hello, World!' },
    code: 0,
  });
});

test('Not found page', async () => {
  const response = await request(server).get(`/test`);

  expect(response.headers['content-type']).toBe(
    'application/json; charset=utf-8'
  );
  expect(response.status).toBe(404);
  expect(response.body).toMatchObject({
    code: 8,
  });
});
