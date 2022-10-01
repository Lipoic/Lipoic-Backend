import { Query } from 'mongoose';
import { init } from '@/util/init';
import { createServer } from '@/util/server';
import { Express } from 'express-serve-static-core';
import {
  test,
  beforeAll,
  expect,
  describe,
  afterAll,
  afterEach,
  beforeEach,
  vi,
} from 'vitest';
import supertest from 'supertest';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { connectDatabase } from '@/database';
import { User } from '@/model/auth/user';

let server: Express;

const mockRestHandlers = [
  rest.post('https://oauth2.googleapis.com/token', (_req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        access_token: 'test',
        expires_in: 3600,
        token_type: 'Bearer',
        id_token: 'test',
      })
    );
  }),
  rest.get(
    'https://www.googleapis.com/oauth2/v1/userinfo?alt=json',
    (_req, res, ctx) => {
      return res(
        ctx.status(200),
        ctx.json({
          id: 'test',
          name: 'test user',
          email: 'test@test.com',
          picture: 'test',
        })
      );
    }
  ),
];

const mockServer = setupServer(...mockRestHandlers);

beforeAll(async () => {
  init();
  mockServer.listen({ onUnhandledRequest: 'bypass' });
  server = createServer();
  await connectDatabase();
});
afterAll(() => mockServer.close());
// Reset data after each test "important for test isolation"
beforeEach(() => init());
// Reset handlers after each test "important for test isolation"
afterEach(() => {
  mockServer.resetHandlers();
});

describe('Google OAuth', () => {
  test('Get google auth URL', async () => {
    process.env.GOOGLE_OAUTH_SECRET = 'test';
    process.env.GOOGLE_OAUTH_ID = 'test';

    const response = await supertest(server).get(
      `/authentication/google/url?redirectUri=https://localhost:3000/login`
    );

    expect(response.status).toBe(200);
    expect(response.headers['content-type']).toBe(
      'application/json; charset=utf-8'
    );
    expect(response.body).toEqual({
      code: 0,
      data: {
        url: 'https://accounts.google.com/o/oauth2/auth?client_id=test&redirect_uri=https%3A%2F%2Flocalhost%3A3000%2Flogin&scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.profile%20https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.email&response_type=code',
      },
    });

    delete process.env.GOOGLE_OAUTH_SECRET;
    delete process.env.GOOGLE_OAUTH_ID;
  });

  test('Get google auth URL without redirectUri', async () => {
    const response = await supertest(server).get(`/authentication/google/url`);

    expect(response.status).toBe(400);
    expect(response.headers['content-type']).toBe(
      'application/json; charset=utf-8'
    );
    expect(response.body).toEqual({
      code: 2,
    });
  });

  test('Get google auth URL without client secret', async () => {
    delete process.env.GOOGLE_OAUTH_SECRET;
    process.env.GOOGLE_OAUTH_ID = 'test';

    const response = await supertest(server).get(
      `/authentication/google/url?redirectUri=https://localhost:3000/login`
    );

    expect(response.status).toBe(500);
    expect(response.headers['content-type']).toBe(
      'application/json; charset=utf-8'
    );
    expect(response.body).toEqual({
      code: 2,
    });

    delete process.env.GOOGLE_OAUTH_ID;
  });

  test('Get google auth URL without client id', async () => {
    delete process.env.GOOGLE_OAUTH_ID;
    process.env.GOOGLE_OAUTH_SECRET = 'test';

    const response = await supertest(server).get(
      `/authentication/google/url?redirectUri=https://localhost:3000/login`
    );

    expect(response.status).toBe(500);
    expect(response.headers['content-type']).toBe(
      'application/json; charset=utf-8'
    );
    expect(response.body).toEqual({
      code: 2,
    });

    delete process.env.GOOGLE_OAUTH_SECRET;
  });

  test('Get google auth URL without client id and secret', async () => {
    delete process.env.GOOGLE_OAUTH_ID;
    delete process.env.GOOGLE_OAUTH_SECRET;

    const response = await supertest(server).get(
      `/authentication/google/url?redirectUri=https://localhost:3000/login`
    );

    expect(response.status).toBe(500);
    expect(response.headers['content-type']).toBe(
      'application/json; charset=utf-8'
    );
    expect(response.body).toEqual({
      code: 2,
    });
  });

  test('Get access token by google oauth code', async () => {
    process.env.GOOGLE_OAUTH_ID = 'TEST';
    process.env.GOOGLE_OAUTH_SECRET = 'TEST';

    const code = 'test code';
    const response = await supertest(server).get(
      `/authentication/google/callback?code=${code}&redirectUri=https://localhost:3000/login`
    );

    expect(response.status).toBe(200);
    expect(response.headers['content-type']).toBe(
      'application/json; charset=utf-8'
    );
    expect(response.body['code']).toBe(0);
    expect(response.body['data']).toHaveProperty('token');
    expect(response.body['data']['token'].length).toBe(214);
  });

  test('Get access token by google oauth code without redirectUri', async () => {
    process.env.GOOGLE_OAUTH_ID = 'TEST';
    process.env.GOOGLE_OAUTH_SECRET = 'TEST';

    const code = 'test code';
    const response = await supertest(server).get(
      `/authentication/google/callback?code=${code}`
    );

    expect(response.status).toBe(400);
    expect(response.headers['content-type']).toBe(
      'application/json; charset=utf-8'
    );
    expect(response.body).toEqual({
      code: 3,
    });
  });

  test('Get access token by google oauth code without code', async () => {
    process.env.GOOGLE_OAUTH_ID = 'TEST';
    process.env.GOOGLE_OAUTH_SECRET = 'TEST';

    const response = await supertest(server).get(
      `/authentication/google/callback?redirectUri=https://localhost:3000/login`
    );

    expect(response.status).toBe(400);
    expect(response.headers['content-type']).toBe(
      'application/json; charset=utf-8'
    );
    expect(response.body).toEqual({
      code: 3,
    });
  });

  test('Get access token by google oauth code without code and redirectUri', async () => {
    process.env.GOOGLE_OAUTH_ID = 'TEST';
    process.env.GOOGLE_OAUTH_SECRET = 'TEST';

    const response = await supertest(server).get(
      `/authentication/google/callback`
    );

    expect(response.status).toBe(400);
    expect(response.headers['content-type']).toBe(
      'application/json; charset=utf-8'
    );
    expect(response.body).toEqual({
      code: 3,
    });
  });

  test('Get access token by google oauth code without client secret', async () => {
    delete process.env.GOOGLE_OAUTH_SECRET;
    process.env.GOOGLE_OAUTH_ID = 'test';

    const code = 'test code';
    const response = await supertest(server).get(
      `/authentication/google/callback?code=${code}&redirectUri=https://localhost:3000/login`
    );

    expect(response.status).toBe(500);
    expect(response.headers['content-type']).toBe(
      'application/json; charset=utf-8'
    );
    expect(response.body).toEqual({
      code: 3,
    });

    delete process.env.GOOGLE_OAUTH_ID;
  });

  test('Get access token by google oauth code without client id', async () => {
    delete process.env.GOOGLE_OAUTH_ID;
    process.env.GOOGLE_OAUTH_SECRET = 'test';

    const code = 'test code';
    const response = await supertest(server).get(
      `/authentication/google/callback?code=${code}&redirectUri=https://localhost:3000/login`
    );

    expect(response.status).toBe(500);
    expect(response.headers['content-type']).toBe(
      'application/json; charset=utf-8'
    );
    expect(response.body).toEqual({
      code: 3,
    });

    delete process.env.GOOGLE_OAUTH_SECRET;
  });

  test('Get access token by google oauth code without client id and secret', async () => {
    delete process.env.GOOGLE_OAUTH_ID;
    delete process.env.GOOGLE_OAUTH_SECRET;

    const code = 'test code';
    const response = await supertest(server).get(
      `/authentication/google/callback?code=${code}&redirectUri=https://localhost:3000/login`
    );

    expect(response.status).toBe(500);
    expect(response.headers['content-type']).toBe(
      'application/json; charset=utf-8'
    );
    expect(response.body).toEqual({
      code: 3,
    });
  });
});

describe('Facebook OAuth', () => {
  test('Get facebook auth URL', async () => {
    delete process.env.FACEBOOK_OAUTH_ID;
    delete process.env.FACEBOOK_OAUTH_SECRET;
    process.env.FACEBOOK_OAUTH_SECRET = 'test';
    process.env.FACEBOOK_OAUTH_ID = 'test';

    const response = await supertest(server).get(
      `/authentication/facebook/url?redirectUri=https://localhost:3000/login`
    );

    expect(response.status).toBe(200);
    expect(response.headers['content-type']).toBe(
      'application/json; charset=utf-8'
    );
    expect(response.body).toEqual({
      code: 0,
      data: {
        url: 'https://www.facebook.com/dialog/oauth?client_id=test&redirect_uri=https%3A%2F%2Flocalhost%3A3000%2Flogin&scope=public_profile%2Cemail&response_type=code',
      },
    });

    delete process.env.FACEBOOK_OAUTH_SECRET;
    delete process.env.FACEBOOK_OAUTH_ID;
  });

  test('Get facebook auth URL without redirectUri', async () => {
    const response = await supertest(server).get(
      `/authentication/facebook/url`
    );

    expect(response.status).toBe(400);
    expect(response.headers['content-type']).toBe(
      'application/json; charset=utf-8'
    );
    expect(response.body).toEqual({
      code: 2,
    });
  });

  test('Get facebook auth URL without client secret', async () => {
    delete process.env.FACEBOOK_OAUTH_SECRET;
    process.env.FACEBOOK_OAUTH_ID = 'test';

    const response = await supertest(server).get(
      `/authentication/facebook/url?redirectUri=https://localhost:3000/login`
    );

    expect(response.status).toBe(500);
    expect(response.headers['content-type']).toBe(
      'application/json; charset=utf-8'
    );
    expect(response.body).toEqual({
      code: 2,
    });

    delete process.env.FACEBOOK_OAUTH_ID;
  });

  test('Get facebook auth URL without client id', async () => {
    delete process.env.FACEBOOK_OAUTH_ID;
    process.env.FACEBOOK_OAUTH_SECRET = 'test';

    const response = await supertest(server).get(
      `/authentication/facebook/url?redirectUri=https://localhost:3000/login`
    );

    expect(response.status).toBe(500);
    expect(response.headers['content-type']).toBe(
      'application/json; charset=utf-8'
    );
    expect(response.body).toEqual({
      code: 2,
    });

    delete process.env.FACEBOOK_OAUTH_SECRET;
  });

  test('Get facebook auth URL without client id and secret', async () => {
    delete process.env.FACEBOOK_OAUTH_ID;
    delete process.env.FACEBOOK_OAUTH_SECRET;

    const response = await supertest(server).get(
      `/authentication/facebook/url?redirectUri=https://localhost:3000/login`
    );

    expect(response.status).toBe(500);
    expect(response.headers['content-type']).toBe(
      'application/json; charset=utf-8'
    );
    expect(response.body).toEqual({
      code: 2,
    });
  });
});
