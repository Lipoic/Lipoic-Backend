import { init } from '@/util/init';
import { createServer } from '@/util/server';
import { Express } from 'express-serve-static-core';
import { test, beforeAll, expect, describe } from 'vitest';
import supertest from 'supertest';

let server: Express;

beforeAll(() => {
  init();
  server = createServer();
});

describe('Google OAuth', () => {
  test('Get google auth URL', async () => {
    process.env.GOOGLE_OAUTH_SECRET = 'test';
    process.env.GOOGLE_OAUTH_ID = 'test';

    const response = await supertest(server).get(
      `/authentication/google/url?redirect_uri=https://localhost:3000/login`
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

  test('Get google auth URL without redirect_uri', async () => {
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
    process.env.GOOGLE_OAUTH_ID = 'test';

    const response = await supertest(server).get(
      `/authentication/google/url?redirect_uri=https://localhost:3000/login`
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
    process.env.GOOGLE_OAUTH_SECRET = 'test';

    const response = await supertest(server).get(
      `/authentication/google/url?redirect_uri=https://localhost:3000/login`
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
    const response = await supertest(server).get(
      `/authentication/google/url?redirect_uri=https://localhost:3000/login`
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

describe('Facebook OAuth', () => {
  test('Get facebook auth URL', async () => {
    process.env.FACEBOOK_OAUTH_SECRET = 'test';
    process.env.FACEBOOK_OAUTH_ID = 'test';

    const response = await supertest(server).get(
      `/authentication/facebook/url?redirect_uri=https://localhost:3000/login`
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

  test('Get facebook auth URL without redirect_uri', async () => {
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
    process.env.FACEBOOK_OAUTH_ID = 'test';

    const response = await supertest(server).get(
      `/authentication/facebook/url?redirect_uri=https://localhost:3000/login`
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
    process.env.FACEBOOK_OAUTH_SECRET = 'test';

    const response = await supertest(server).get(
      `/authentication/facebook/url?redirect_uri=https://localhost:3000/login`
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
    const response = await supertest(server).get(
      `/authentication/facebook/url?redirect_uri=https://localhost:3000/login`
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
