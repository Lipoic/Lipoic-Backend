import { createServer } from '@/util/server';
import supertest from 'supertest';
import { Express } from 'express-serve-static-core';
import { test, expect, beforeAll } from 'vitest';
import { init } from '@/util/init';

let server: Express;

beforeAll(() => {
  init();
  server = createServer();
});

test('Hello world', async () => {
  const response = await supertest(server).get(`/`);

  expect(response.headers['content-type']).toBe(
    'application/json; charset=utf-8'
  );
  expect(response.status).toBe(200);
  expect(response.body).toEqual({
    data: { message: 'Hello, World!' },
    code: 0,
  });
});

test('Not found page', async () => {
  const response = await supertest(server).get(`/test`);

  expect(response.headers['content-type']).toBe(
    'application/json; charset=utf-8'
  );
  expect(response.status).toBe(404);
  expect(response.body).toEqual({
    code: 1,
  });
});
