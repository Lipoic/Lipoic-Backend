import { createServer } from '@/util/server';
import supertest from 'supertest';
import { Express } from 'express-serve-static-core';
import { test, expect, beforeAll, describe } from 'vitest';
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

describe('Get client ip', () => {
  test('Get client ip', async () => {
    const response = await supertest(server).get(`/ip`);

    expect(response.headers['content-type']).toBe(
      'application/json; charset=utf-8'
    );
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      code: 0,
      data: { ip: '::ffff:127.0.0.1' },
    });
  });

  test('Get client ip with cloudflare proxy', async () => {
    process.env.CLOUDFLARE = 'true';

    const response = await supertest(server)
      .get(`/ip`)
      .set('cf-connecting-ip', '::ffff:123.123.123.1');

    expect(response.headers['content-type']).toBe(
      'application/json; charset=utf-8'
    );
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      code: 0,
      data: {
        ip: '::ffff:123.123.123.1',
      },
    });

    delete process.env.CLOUDFLARE;
  });

  test('Get client ip with cloudflare proxy without cf-connecting-ip header', async () => {
    process.env.CLOUDFLARE = 'true';

    const response = await supertest(server).get(`/ip`);

    expect(response.headers['content-type']).toBe(
      'application/json; charset=utf-8'
    );
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      code: 0,
      data: {
        ip: '::ffff:127.0.0.1',
      },
    });

    delete process.env.CLOUDFLARE;
  });
});
