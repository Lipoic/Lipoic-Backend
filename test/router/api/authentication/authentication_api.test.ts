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
} from 'vitest';
import supertest from 'supertest';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { Database, connectDatabase } from '@/database';

let server: Express;
let db: Database;

const mockRestHandlers = [
  rest.post('https://oauth2.googleapis.com/token', async (req, res, ctx) => {
    if ((await req.text()).includes('test code')) {
      return res(
        ctx.status(200),
        ctx.json({
          access_token: 'test',
          expires_in: 3600,
          token_type: 'Bearer',
          id_token: 'test',
        })
      );
    } else {
      return res(ctx.status(400));
    }
  }),
  rest.get(
    'https://www.googleapis.com/oauth2/v1/userinfo',
    (_req, res, ctx) => {
      return res(
        ctx.status(200),
        ctx.json({
          id: 'google_test',
          name: 'Google Test user',
          email: 'test@test.com',
          picture: 'test',
          locale: 'en-US',
        })
      );
    }
  ),
  rest.get(
    'https://graph.facebook.com/v14.0/oauth/access_token',
    (req, res, ctx) => {
      if (req.url.searchParams.get('code') === 'test code') {
        return res(
          ctx.status(200),
          ctx.json({
            access_token: 'test',
            expires_in: 3600,
            token_type: 'Bearer',
            id_token: 'test',
          })
        );
      } else {
        return res(ctx.status(400));
      }
    }
  ),
  rest.get('https://graph.facebook.com/v14.0/me', (_req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        id: 'facebook_test',
        name: 'Facebook Test user',
        email: 'test@test.com',
        picture: {
          data: {
            url: 'test',
          },
        },
      })
    );
  }),
];

const mockServer = setupServer(...mockRestHandlers);

beforeAll(async () => {
  init();
  mockServer.listen({ onUnhandledRequest: 'bypass' });
  server = createServer();
  db = await connectDatabase('test');
});
afterAll(() => mockServer.close());
// Reset data after each test "important for test isolation"
beforeEach(() => init());
// Reset handlers after each test "important for test isolation"
afterEach(async () => {
  mockServer.resetHandlers();
  await db.connection.dropDatabase();
});

describe('Google OAuth', () => {
  test('Get google auth URL', async () => {
    process.env.GOOGLE_OAUTH_SECRET = 'test';
    process.env.GOOGLE_OAUTH_ID = 'test';

    const response = await supertest(server)
      .get('/authentication/google/url')
      .query({ redirectUri: 'https://localhost:3000/login' });

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

    const response = await supertest(server)
      .get('/authentication/google/url')
      .query({ redirectUri: 'https://localhost:3000/login' });

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

    const response = await supertest(server)
      .get('/authentication/google/url')
      .query({ redirectUri: 'https://localhost:3000/login' });

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

    const response = await supertest(server)
      .get('/authentication/google/url')
      .query({ redirectUri: 'https://localhost:3000/login' });

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
    const response = await supertest(server)
      .get('/authentication/google/callback')
      .query({
        code,
        redirectUri: 'https://localhost:3000/login',
        locale: 'en-US',
      });

    expect(response.status).toBe(200);
    expect(response.headers['content-type']).toBe(
      'application/json; charset=utf-8'
    );
    expect(response.body['code']).toBe(0);
    expect(response.body['data']).toHaveProperty('token');
    expect(response.body['data']['token'].length).toBe(214);
  });

  test('Get access token by google oauth code without redirectUri and locale', async () => {
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

  test('Get access token by google oauth code without code and locale', async () => {
    process.env.GOOGLE_OAUTH_ID = 'TEST';
    process.env.GOOGLE_OAUTH_SECRET = 'TEST';

    const response = await supertest(server)
      .get('/authentication/google/callback')
      .query({ redirectUri: 'https://localhost:3000/login' });

    expect(response.status).toBe(400);
    expect(response.headers['content-type']).toBe(
      'application/json; charset=utf-8'
    );
    expect(response.body).toEqual({
      code: 3,
    });
  });

  test('Get access token by google oauth code without locale', async () => {
    process.env.GOOGLE_OAUTH_ID = 'TEST';
    process.env.GOOGLE_OAUTH_SECRET = 'TEST';

    const code = 'test code';
    const response = await supertest(server)
      .get('/authentication/google/callback')
      .query({ code, redirectUri: 'https://localhost:3000/login' });

    expect(response.status).toBe(400);
    expect(response.headers['content-type']).toBe(
      'application/json; charset=utf-8'
    );
    expect(response.body).toEqual({
      code: 3,
    });
  });

  test('Get access token by google oauth code without code and redirectUri and locale', async () => {
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
    const response = await supertest(server)
      .get('/authentication/google/callback')
      .query({
        code,
        redirectUri: 'https://localhost:3000/login',
        locale: 'en-US',
      });

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
    const response = await supertest(server)
      .get('/authentication/google/callback')
      .query({
        code,
        redirectUri: 'https://localhost:3000/login',
        locale: 'en-US',
      });

    expect(response.status).toBe(500);
    expect(response.headers['content-type']).toBe(
      'application/json; charset=utf-8'
    );
    expect(response.body).toEqual({
      code: 3,
    });
  });

  test('Get access token by google oauth code without client id and secret', async () => {
    delete process.env.GOOGLE_OAUTH_ID;
    delete process.env.GOOGLE_OAUTH_SECRET;

    const code = 'test code';
    const response = await supertest(server)
      .get('/authentication/google/callback')
      .query({
        code,
        redirectUri: 'https://localhost:3000/login',
        locale: 'en-US',
      });

    expect(response.status).toBe(500);
    expect(response.headers['content-type']).toBe(
      'application/json; charset=utf-8'
    );
    expect(response.body).toEqual({
      code: 3,
    });
  });

  test('Get access token by google oauth code with invalid code', async () => {
    process.env.GOOGLE_OAUTH_ID = 'TEST';
    process.env.GOOGLE_OAUTH_SECRET = 'TEST';

    const code = 'invalid code';
    const response = await supertest(server)
      .get('/authentication/google/callback')
      .query({
        code,
        redirectUri: 'https://localhost:3000/login',
        locale: 'en-US',
      });

    expect(response.status).toBe(400);
    expect(response.headers['content-type']).toBe(
      'application/json; charset=utf-8'
    );
    expect(response.body).toEqual({
      code: 3,
    });
  });

  test('Get access token by google oauth code with invalid locale', async () => {
    process.env.GOOGLE_OAUTH_ID = 'TEST';
    process.env.GOOGLE_OAUTH_SECRET = 'TEST';

    const code = 'test code';
    const response = await supertest(server)
      .get('/authentication/google/callback')
      .query({
        code,
        redirectUri: 'https://localhost:3000/login',
        locale: 'invalid locale',
      });

    expect(response.status).toBe(400);
    expect(response.headers['content-type']).toBe(
      'application/json; charset=utf-8'
    );
    expect(response.body).toEqual({
      code: 3,
    });
  });

  // https://github.com/Lipoic/Lipoic-Backend/issues/17
  test('Repeated get access token by google oauth code', async () => {
    process.env.GOOGLE_OAUTH_ID = 'TEST';
    process.env.GOOGLE_OAUTH_SECRET = 'TEST';

    const code = 'test code';

    async function getAccessToken(): Promise<string> {
      const response = await supertest(server)
        .get('/authentication/google/callback')
        .query({
          code,
          redirectUri: 'https://localhost:3000/login',
          locale: 'en-US',
        });

      return response.body['data']['token'];
    }

    const token = await getAccessToken();
    await getAccessToken();

    // Check only created one OAuth connection
    const userInfoResponse = await supertest(server)
      .get('/user/info')
      .auth(token, { type: 'bearer' });

    expect(userInfoResponse.status).toBe(200);
    expect(userInfoResponse.headers['content-type']).toBe(
      'application/json; charset=utf-8'
    );
    expect(userInfoResponse.body['code']).toBe(0);
    expect(userInfoResponse.body['data']['connects']).toHaveLength(1);
    expect(userInfoResponse.body['data']['connects'][0]['accountType']).toBe(
      'Google'
    );
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

  test('Get access token by facebook oauth code', async () => {
    process.env.FACEBOOK_OAUTH_ID = 'TEST';
    process.env.FACEBOOK_OAUTH_SECRET = 'TEST';

    const code = 'test code';
    const response = await supertest(server)
      .get('/authentication/facebook/callback')
      .query({
        code,
        redirectUri: 'https://localhost:3000/login',
        locale: 'en-US',
      });

    expect(response.status).toBe(200);
    expect(response.headers['content-type']).toBe(
      'application/json; charset=utf-8'
    );
    expect(response.body['code']).toBe(0);
    expect(response.body['data']).toHaveProperty('token');
    expect(response.body['data']['token'].length).toBe(214);
  });

  test('Get access token by facebook oauth code without redirectUri and locale', async () => {
    process.env.FACEBOOK_OAUTH_ID = 'TEST';
    process.env.FACEBOOK_OAUTH_SECRET = 'TEST';

    const code = 'test code';
    const response = await supertest(server)
      .get('/authentication/facebook/callback')
      .query({ code });

    expect(response.status).toBe(400);
    expect(response.headers['content-type']).toBe(
      'application/json; charset=utf-8'
    );
    expect(response.body).toEqual({
      code: 3,
    });
  });

  test('Get access token by facebook oauth code without code and locale', async () => {
    process.env.FACEBOOK_OAUTH_ID = 'TEST';
    process.env.FACEBOOK_OAUTH_SECRET = 'TEST';

    const response = await supertest(server)
      .get('/authentication/facebook/callback')
      .query({ redirectUri: 'https://localhost:3000/login' });

    expect(response.status).toBe(400);
    expect(response.headers['content-type']).toBe(
      'application/json; charset=utf-8'
    );
    expect(response.body).toEqual({
      code: 3,
    });
  });

  test('Get access token by facebook oauth code without code and redirectUri and locale', async () => {
    process.env.FACEBOOK_OAUTH_ID = 'TEST';
    process.env.FACEBOOK_OAUTH_SECRET = 'TEST';

    const response = await supertest(server).get(
      `/authentication/facebook/callback`
    );

    expect(response.status).toBe(400);
    expect(response.headers['content-type']).toBe(
      'application/json; charset=utf-8'
    );
    expect(response.body).toEqual({
      code: 3,
    });
  });

  test('Get access token by facebook oauth code without locale', async () => {
    process.env.FACEBOOK_OAUTH_ID = 'TEST';
    process.env.FACEBOOK_OAUTH_SECRET = 'TEST';

    const code = 'test code';
    const response = await supertest(server)
      .get('/authentication/facebook/callback')
      .query({ code, redirectUri: 'https://localhost:3000/login' });

    expect(response.status).toBe(400);
    expect(response.headers['content-type']).toBe(
      'application/json; charset=utf-8'
    );
    expect(response.body).toEqual({
      code: 3,
    });
  });

  test('Get access token by facebook oauth code without client secret', async () => {
    delete process.env.FACEBOOK_OAUTH_SECRET;
    process.env.FACEBOOK_OAUTH_ID = 'TEST';

    const code = 'test code';
    const response = await supertest(server)
      .get('/authentication/facebook/callback')
      .query({
        code,
        redirectUri: 'https://localhost:3000/login',
        locale: 'en-US',
      });

    expect(response.status).toBe(500);
    expect(response.headers['content-type']).toBe(
      'application/json; charset=utf-8'
    );
    expect(response.body).toEqual({
      code: 3,
    });

    delete process.env.FACEBOOK_OAUTH_ID;
  });

  test('Get access token by facebook oauth code without client id', async () => {
    delete process.env.FACEBOOK_OAUTH_ID;
    process.env.FACEBOOK_OAUTH_SECRET = 'TEST';

    const code = 'test code';
    const response = await supertest(server)
      .get('/authentication/facebook/callback')
      .query({
        code,
        redirectUri: 'https://localhost:3000/login',
        locale: 'en-US',
      });

    expect(response.status).toBe(500);
    expect(response.headers['content-type']).toBe(
      'application/json; charset=utf-8'
    );
    expect(response.body).toEqual({
      code: 3,
    });

    delete process.env.FACEBOOK_OAUTH_SECRET;
  });

  test('Get access token by facebook oauth code without client id and secret', async () => {
    delete process.env.FACEBOOK_OAUTH_ID;
    delete process.env.FACEBOOK_OAUTH_SECRET;

    const code = 'test code';
    const response = await supertest(server)
      .get('/authentication/facebook/callback')
      .query({
        code,
        redirectUri: 'https://localhost:3000/login',
        locale: 'en-US',
      });

    expect(response.status).toBe(500);
    expect(response.headers['content-type']).toBe(
      'application/json; charset=utf-8'
    );
    expect(response.body).toEqual({
      code: 3,
    });
  });

  test('Get access token by facebook oauth code with invalid code', async () => {
    process.env.FACEBOOK_OAUTH_ID = 'TEST';
    process.env.FACEBOOK_OAUTH_SECRET = 'TEST';

    const code = 'invalid code';
    const response = await supertest(server).get(
      `/authentication/facebook/callback?code=${code}&redirectUri=https://localhost:3000/login`
    );

    expect(response.status).toBe(400);
    expect(response.headers['content-type']).toBe(
      'application/json; charset=utf-8'
    );
    expect(response.body['code']).toBe(3);
    expect(response.body['data']).toBeUndefined();
  });

  test('Get access token by facebook oauth code with invalid locale', async () => {
    process.env.FACEBOOK_OAUTH_ID = 'TEST';
    process.env.FACEBOOK_OAUTH_SECRET = 'TEST';

    const code = 'test code';
    const response = await supertest(server)
      .get('/authentication/facebook/callback')
      .query({
        code,
        redirectUri: 'https://localhost:3000/login',
        locale: 'invalid locale',
      });

    expect(response.status).toBe(400);
    expect(response.headers['content-type']).toBe(
      'application/json; charset=utf-8'
    );
    expect(response.body).toEqual({
      code: 3,
    });
  });

  // https://github.com/Lipoic/Lipoic-Backend/issues/17
  test('Repeated get access token by google oauth code', async () => {
    process.env.FACEBOOK_OAUTH_ID = 'TEST';
    process.env.FACEBOOK_OAUTH_SECRET = 'TEST';

    const code = 'test code';

    async function getAccessToken(): Promise<string> {
      const response = await supertest(server)
        .get('/authentication/facebook/callback')
        .query({
          code,
          redirectUri: 'https://localhost:3000/login',
          locale: 'en-US',
        });

      return response.body['data']['token'];
    }

    const token = await getAccessToken();
    await getAccessToken();

    // Check only created one OAuth connection
    const userInfoResponse = await supertest(server)
      .get('/user/info')
      .auth(token, { type: 'bearer' });

    expect(userInfoResponse.status).toBe(200);
    expect(userInfoResponse.headers['content-type']).toBe(
      'application/json; charset=utf-8'
    );
    expect(userInfoResponse.body['code']).toBe(0);
    expect(userInfoResponse.body['data']['connects']).toHaveLength(1);
    expect(userInfoResponse.body['data']['connects'][0]['accountType']).toBe(
      'Facebook'
    );
  });
});
