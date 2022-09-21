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
    message: 'Success',
    response_status_code: 0,
    http_status_code: 200,
    data: { message: 'hello, world.' },
  });
});

test('Not found page', async () => {
  const response = await request(server).get(`/test`);

  expect(response.headers['content-type']).toBe(
    'application/json; charset=utf-8'
  );
  expect(response.status).toBe(404);
  expect(response.body).toMatchObject({
    message: 'Resource not found.',
    response_status_code: 8,
    http_status_code: 404,
    data: 'Router not found.',
  });
});
