import { createVerifyEmailCode, passwordHash } from '#/api/user/util';
import { createServer } from '@/util/server';
import {
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  test,
  vi,
} from 'vitest';
import { Express } from 'express-serve-static-core';
import { init } from '@/util/init';
import { Database, connectDatabase } from '@/database';
import { User } from '@/model/auth/user';
import supertest from 'supertest';
import Mail from 'nodemailer/lib/mailer';
import * as fs from 'fs';

let server: Express;
let db: Database;

beforeAll(async () => {
  init();
  server = createServer();
  db = await connectDatabase('test');
});

// Reset data after each test "important for test isolation"
beforeEach(() => init());
// Reset handlers after each test "important for test isolation"
afterEach(async () => {
  await db.connection.dropDatabase();
});

describe('Get the info of the current user', () => {
  test('Get the info of the current user', async () => {
    const user = new User({
      username: 'test',
      email: 'test@test.com',
      verifiedEmail: true,
      connects: [],
      modes: [],
      loginIps: [],
      locale: 'en-US',
    });

    await user.save();

    const token = user.generateJWTToken();

    const response = await supertest(server)
      .get('/user/info')
      .auth(token, { type: 'bearer' });

    expect(response.status).toBe(200);
    expect(response.headers['content-type']).toBe(
      'application/json; charset=utf-8'
    );
    expect(response.body).toEqual({
      code: 0,
      data: {
        id: user.id,
        username: 'test',
        verifiedEmail: true,
        modes: [],
        locale: 'en-US',
        createdAt: user.createdAt?.toISOString(),
        updatedAt: user.updatedAt?.toISOString(),
        email: 'test@test.com',
        connects: [],
      },
    });
  });

  test('Get the info of the current user and invalid token', async () => {
    const token = 'invalid token';

    const response = await supertest(server)
      .get('/user/info')
      .auth(token, { type: 'bearer' });

    expect(response.status).toBe(401);
    expect(response.headers['content-type']).toBe(
      'application/json; charset=utf-8'
    );
    expect(response.body).toEqual({
      code: 4,
    });
  });

  test('Get the info of the current user and invalid token type', async () => {
    const token = 'invalid token';

    const response = await supertest(server)
      .get('/user/info')
      .set('Authorization', token);

    expect(response.status).toBe(401);
    expect(response.headers['content-type']).toBe(
      'application/json; charset=utf-8'
    );
    expect(response.body).toEqual({
      code: 4,
    });
  });

  test('Get the info of the current user without authorization', async () => {
    const response = await supertest(server).get('/user/info');

    expect(response.status).toBe(401);
    expect(response.headers['content-type']).toBe(
      'application/json; charset=utf-8'
    );
    expect(response.body).toEqual({
      code: 4,
    });
  });
});

describe('Get the user info by user id', () => {
  test('Get the user info by user id', async () => {
    const user = new User({
      username: 'test',
      email: 'test@test.com',
      verifiedEmail: true,
      connects: [],
      modes: [],
      loginIps: [],
      locale: 'en-US',
    });

    await user.save();

    const response = await supertest(server).get(`/user/info/${user.id}`);

    expect(response.status).toBe(200);
    expect(response.headers['content-type']).toBe(
      'application/json; charset=utf-8'
    );
    expect(response.body).toEqual({
      code: 0,
      data: {
        id: user.id,
        username: 'test',
        verifiedEmail: true,
        modes: [],
        locale: 'en-US',
        createdAt: user.createdAt?.toISOString(),
        updatedAt: user.updatedAt?.toISOString(),
      },
    });
  });

  test('Get the user info by user id and invalid user id', async () => {
    const response = await supertest(server).get('/user/info/invalid id');

    expect(response.status).toBe(404);
    expect(response.headers['content-type']).toBe(
      'application/json; charset=utf-8'
    );
    expect(response.body).toEqual({
      code: 5,
    });
  });
});

describe('Edit the info of the current user', () => {
  test('Edit the info of the current user', async () => {
    const user = new User({
      username: 'user 1',
      email: 'test@test.com',
      verifiedEmail: true,
      connects: [],
      modes: [],
      loginIps: [],
      locale: 'en-US',
    });

    await user.save();
    const token = user.generateJWTToken();

    const response = await supertest(server)
      .patch('/user/info')
      .auth(token, { type: 'bearer' })
      .send({
        username: 'user 2',
        modes: ['Student'],
        locale: 'zh-TW',
      });

    expect(response.status).toBe(200);
    expect(response.headers['content-type']).toBe(
      'application/json; charset=utf-8'
    );
    expect(response.body).toMatchObject({
      code: 0,
      data: {
        id: user.id,
        username: 'user 2',
        verifiedEmail: true,
        modes: ['Student'],
        locale: 'zh-TW',
        createdAt: user.createdAt?.toISOString(),
      },
    });
  });

  test('Edit the info of the current user and invalid token', async () => {
    const token = 'invalid token';

    const response = await supertest(server)
      .patch('/user/info')
      .auth(token, { type: 'bearer' })
      .send({
        username: 'user 2',
        modes: ['Student'],
        locale: 'zh-TW',
      });

    expect(response.status).toBe(401);
    expect(response.headers['content-type']).toBe(
      'application/json; charset=utf-8'
    );
    expect(response.body).toEqual({
      code: 4,
    });
  });

  test('Edit the info of the current user and invalid token type', async () => {
    const token = 'invalid token';

    const response = await supertest(server)
      .patch('/user/info')
      .set('Authorization', token)
      .send({
        username: 'user 2',
        modes: ['Student'],
        locale: 'zh-TW',
      });

    expect(response.status).toBe(401);
    expect(response.headers['content-type']).toBe(
      'application/json; charset=utf-8'
    );
    expect(response.body).toEqual({
      code: 4,
    });
  });

  test('Edit the info of the current user without authorization', async () => {
    const response = await supertest(server)
      .patch('/user/info')
      .send({
        username: 'user 2',
        modes: ['Student'],
        locale: 'zh-TW',
      });

    expect(response.status).toBe(401);
    expect(response.headers['content-type']).toBe(
      'application/json; charset=utf-8'
    );
    expect(response.body).toEqual({
      code: 4,
    });
  });

  test('Edit the info of the current user and only edit username', async () => {
    const user = new User({
      username: 'user 1',
      email: 'test@test.com',
      verifiedEmail: true,
      connects: [],
      modes: [],
      loginIps: [],
      locale: 'en-US',
    });

    await user.save();
    const token = user.generateJWTToken();

    const response = await supertest(server)
      .patch('/user/info')
      .auth(token, { type: 'bearer' })
      .send({
        username: 'user 2',
      });

    expect(response.status).toBe(200);
    expect(response.headers['content-type']).toBe(
      'application/json; charset=utf-8'
    );
    expect(response.body).toMatchObject({
      code: 0,
      data: {
        id: user.id,
        username: 'user 2',
        verifiedEmail: true,
        modes: [],
        locale: 'en-US',
        createdAt: user.createdAt?.toISOString(),
      },
    });
  });

  test('Edit the info of the current user and only edit user mode', async () => {
    const user = new User({
      username: 'user 1',
      email: 'test@test.com',
      verifiedEmail: true,
      connects: [],
      modes: [],
      loginIps: [],
      locale: 'en-US',
    });

    await user.save();
    const token = user.generateJWTToken();

    const response = await supertest(server)
      .patch('/user/info')
      .auth(token, { type: 'bearer' })
      .send({
        modes: ['Student'],
      });

    expect(response.status).toBe(200);
    expect(response.headers['content-type']).toBe(
      'application/json; charset=utf-8'
    );
    expect(response.body).toMatchObject({
      code: 0,
      data: {
        id: user.id,
        username: 'user 1',
        verifiedEmail: true,
        modes: ['Student'],
        locale: 'en-US',
        createdAt: user.createdAt?.toISOString(),
      },
    });
  });

  test('Edit the info of the current user and only edit user locale', async () => {
    const user = new User({
      username: 'user 1',
      email: 'test@test.com',
      verifiedEmail: true,
      connects: [],
      modes: [],
      loginIps: [],
      locale: 'en-US',
    });

    await user.save();
    const token = user.generateJWTToken();

    const response = await supertest(server)
      .patch('/user/info')
      .auth(token, { type: 'bearer' })
      .send({
        locale: 'zh-TW',
      });

    expect(response.status).toBe(200);
    expect(response.headers['content-type']).toBe(
      'application/json; charset=utf-8'
    );
    expect(response.body).toMatchObject({
      code: 0,
      data: {
        id: user.id,
        username: 'user 1',
        verifiedEmail: true,
        modes: [],
        locale: 'zh-TW',
        createdAt: user.createdAt?.toISOString(),
      },
    });
  });

  test("Edit the info of the current user and don't edit anything", async () => {
    const user = new User({
      username: 'user 1',
      email: 'test@test.com',
      verifiedEmail: true,
      connects: [],
      modes: [],
      loginIps: [],
      locale: 'en-US',
    });

    await user.save();
    const token = user.generateJWTToken();

    const response = await supertest(server)
      .patch('/user/info')
      .auth(token, { type: 'bearer' });

    expect(response.status).toBe(200);
    expect(response.headers['content-type']).toBe(
      'application/json; charset=utf-8'
    );
    expect(response.body).toMatchObject({
      code: 0,
      data: {
        id: user.id,
        username: 'user 1',
        verifiedEmail: true,
        modes: [],
        locale: 'en-US',
        createdAt: user.createdAt?.toISOString(),
      },
    });
  });
});

describe('Sign up a new user via email and password', () => {
  test('Sign up a new user via email and password', async () => {
    process.env.CLIENT_URL = 'http://localhost:3000';
    process.env.VERIFY_EMAIL_HOST = '127.0.0.1';
    process.env.VERIFY_EMAIL_PORT = '465';
    process.env.VERIFY_EMAIL_USER = 'test';
    process.env.VERIFY_EMAIL_PASSWORD = 'test';
    process.env.VERIFY_EMAIL_FROM = 'Test Account Group <test@example.com>';

    const mock = vi
      .spyOn(Mail.prototype, 'sendMail')
      .mockResolvedValue(undefined);

    const response = await supertest(server).post('/user/signup').send({
      username: 'user 1',
      email: 'user@test.com',
      password: 'password',
      locale: 'en-US',
    });

    const callData = mock.mock.lastCall?.[0];

    expect(callData?.['from']).toContain('Test Account Group');
    expect(callData?.['to']).toBe('user@test.com');
    expect(callData?.['subject']).toBe('Verify your Lipoic account');
    expect(callData?.['html']).toContain('user 1');
    expect(callData?.['html']).toContain(
      'http://localhost:3000/verify-email/?code='
    );

    expect(response.status).toBe(200);
    expect(response.headers['content-type']).toBe(
      'application/json; charset=utf-8'
    );
    expect(response.body).toEqual({
      code: 0,
    });
  });

  test('Sign up a new user via email and password without username', async () => {
    process.env.VERIFY_EMAIL_HOST = '127.0.0.1';
    process.env.VERIFY_EMAIL_PORT = '465';
    process.env.VERIFY_EMAIL_USER = 'test';
    process.env.VERIFY_EMAIL_PASSWORD = 'test';
    process.env.VERIFY_EMAIL_FROM = 'Test Account Group <test@example.com>';

    vi.spyOn(Mail.prototype, 'sendMail').mockResolvedValue(undefined);

    const response = await supertest(server).post('/user/signup').send({
      email: 'user@test.com',
      password: 'password',
      locale: 'en-US',
    });

    expect(response.status).toBe(400);
    expect(response.headers['content-type']).toBe(
      'application/json; charset=utf-8'
    );
    expect(response.body).toEqual({
      code: 8,
    });
  });

  test('Sign up a new user via email and password without email', async () => {
    process.env.VERIFY_EMAIL_HOST = '127.0.0.1';
    process.env.VERIFY_EMAIL_PORT = '465';
    process.env.VERIFY_EMAIL_USER = 'test';
    process.env.VERIFY_EMAIL_PASSWORD = 'test';
    process.env.VERIFY_EMAIL_FROM = 'Test Account Group <test@example.com>';

    vi.spyOn(Mail.prototype, 'sendMail').mockResolvedValue(undefined);

    const response = await supertest(server).post('/user/signup').send({
      username: 'user 1',
      password: 'password',
      locale: 'en-US',
    });

    expect(response.status).toBe(400);
    expect(response.headers['content-type']).toBe(
      'application/json; charset=utf-8'
    );
    expect(response.body).toEqual({
      code: 8,
    });
  });

  test('Sign up a new user via email and password without password', async () => {
    process.env.VERIFY_EMAIL_HOST = '127.0.0.1';
    process.env.VERIFY_EMAIL_PORT = '465';
    process.env.VERIFY_EMAIL_USER = 'test';
    process.env.VERIFY_EMAIL_PASSWORD = 'test';
    process.env.VERIFY_EMAIL_FROM = 'Test Account Group <test@example.com>';

    vi.spyOn(Mail.prototype, 'sendMail').mockResolvedValue(undefined);

    const response = await supertest(server).post('/user/signup').send({
      username: 'user 1',
      email: 'user@test.com',
      locale: 'en-US',
    });

    expect(response.status).toBe(400);
    expect(response.headers['content-type']).toBe(
      'application/json; charset=utf-8'
    );
    expect(response.body).toEqual({
      code: 8,
    });
  });

  test('Sign up a new user via email and password without locale', async () => {
    process.env.VERIFY_EMAIL_HOST = '127.0.0.1';
    process.env.VERIFY_EMAIL_PORT = '465';
    process.env.VERIFY_EMAIL_USER = 'test';
    process.env.VERIFY_EMAIL_PASSWORD = 'test';
    process.env.VERIFY_EMAIL_FROM = 'Test Account Group <test@example.com>';

    vi.spyOn(Mail.prototype, 'sendMail').mockResolvedValue(undefined);

    const response = await supertest(server).post('/user/signup').send({
      username: 'user 1',
      email: 'user@test.com',
      password: 'password',
    });

    expect(response.status).toBe(400);
    expect(response.headers['content-type']).toBe(
      'application/json; charset=utf-8'
    );
    expect(response.body).toEqual({
      code: 8,
    });
  });

  test('Sign up a new user via email and password and the email is already used', async () => {
    process.env.VERIFY_EMAIL_HOST = '127.0.0.1';
    process.env.VERIFY_EMAIL_PORT = '465';
    process.env.VERIFY_EMAIL_USER = 'test';
    process.env.VERIFY_EMAIL_PASSWORD = 'test';
    process.env.VERIFY_EMAIL_FROM = 'Test Account Group <test@example.com>';

    vi.spyOn(Mail.prototype, 'sendMail').mockResolvedValue(undefined);

    const user = new User({
      username: 'user 1',
      email: 'user@test.com',
      verifiedEmail: true,
      passwordHash: 'the password hash',
      connects: [],
      modes: [],
      loginIps: [],
      locale: 'en-US',
    });
    await user.save();

    const response = await supertest(server).post('/user/signup').send({
      username: 'user 1',
      email: 'user@test.com',
      password: 'password',
      locale: 'en-US',
    });

    expect(response.status).toBe(409);
    expect(response.headers['content-type']).toBe(
      'application/json; charset=utf-8'
    );
    expect(response.body).toEqual({
      code: 7,
    });
  });

  test('Sign up a new user via email and the email is used but not verified', async () => {
    process.env.CLIENT_URL = 'http://localhost:3000';
    process.env.VERIFY_EMAIL_HOST = '127.0.0.1';
    process.env.VERIFY_EMAIL_PORT = '465';
    process.env.VERIFY_EMAIL_USER = 'test';
    process.env.VERIFY_EMAIL_PASSWORD = 'test';
    process.env.VERIFY_EMAIL_FROM = 'Test Account Group <test@example.com>';

    const mock = vi
      .spyOn(Mail.prototype, 'sendMail')
      .mockResolvedValue(undefined);

    const user = new User({
      username: 'user 1',
      email: 'user@test.com',
      verifiedEmail: false,
      passwordHash: 'the password hash',
      connects: [],
      modes: [],
      loginIps: [],
      locale: 'en-US',
    });
    await user.save();

    const response = await supertest(server).post('/user/signup').send({
      username: 'user 1',
      email: 'user@test.com',
      password: 'password',
      locale: 'en-US',
    });

    const callData = mock.mock.lastCall?.[0];

    expect(callData?.['from']).toContain('Test Account Group');
    expect(callData?.['to']).toBe('user@test.com');
    expect(callData?.['subject']).toBe('Verify your Lipoic account');
    expect(callData?.['html']).toContain('user 1');
    expect(callData?.['html']).toContain(
      'http://localhost:3000/verify-email/?code='
    );

    expect(response.status).toBe(200);
    expect(response.headers['content-type']).toBe(
      'application/json; charset=utf-8'
    );
    expect(response.body).toEqual({
      code: 0,
    });
  });

  test('Sign up a new user via email and the email is used but the verify email is expired', async () => {
    process.env.CLIENT_URL = 'http://localhost:3000';
    process.env.VERIFY_EMAIL_HOST = '127.0.0.1';
    process.env.VERIFY_EMAIL_PORT = '465';
    process.env.VERIFY_EMAIL_USER = 'test';
    process.env.VERIFY_EMAIL_PASSWORD = 'test';
    process.env.VERIFY_EMAIL_FROM = 'Test Account Group <test@example.com>';

    const mock = vi
      .spyOn(Mail.prototype, 'sendMail')
      .mockResolvedValue(undefined);

    const user = new User({
      username: 'user 1',
      email: 'user@test.com',
      verifiedEmail: false,
      lastSentVerifyEmailTime: new Date(Date.now() - 1000 * 60 * 10),
      passwordHash: 'the password hash',
      connects: [],
      modes: [],
      loginIps: [],
      locale: 'en-US',
    });
    await user.save();

    const response = await supertest(server).post('/user/signup').send({
      username: 'user 1',
      email: 'user@test.com',
      password: 'password',
      locale: 'en-US',
    });

    const callData = mock.mock.lastCall?.[0];

    expect(callData?.['from']).toContain('Test Account Group');
    expect(callData?.['to']).toBe('user@test.com');
    expect(callData?.['subject']).toBe('Verify your Lipoic account');
    expect(callData?.['html']).toContain('user 1');
    expect(callData?.['html']).toContain(
      'http://localhost:3000/verify-email/?code='
    );

    expect(response.status).toBe(200);
    expect(response.headers['content-type']).toBe(
      'application/json; charset=utf-8'
    );
    expect(response.body).toEqual({
      code: 0,
    });
  });

  // If the verify email is not expired, the user should not receive a new verify email
  test('Sign up a new user via email and the email is used but the verify email is not expired', async () => {
    process.env.CLIENT_URL = 'http://localhost:3000';
    process.env.VERIFY_EMAIL_HOST = '127.0.0.1';
    process.env.VERIFY_EMAIL_PORT = '465';
    process.env.VERIFY_EMAIL_USER = 'test';
    process.env.VERIFY_EMAIL_PASSWORD = 'test';
    process.env.VERIFY_EMAIL_FROM = 'Test Account Group <test@example.com>';

    const mock = vi
      .spyOn(Mail.prototype, 'sendMail')
      .mockResolvedValue(undefined);

    const user = new User({
      username: 'user 1',
      email: 'user@test.com',
      verifiedEmail: false,
      lastSentVerifyEmailTime: new Date(Date.now()),
      passwordHash: 'the password hash',
      connects: [],
      modes: [],
      loginIps: [],
      locale: 'en-US',
    });
    await user.save();

    const response = await supertest(server).post('/user/signup').send({
      username: 'user 1',
      email: 'user@test.com',
      password: 'password',
      locale: 'en-US',
    });

    const callData = mock.mock.lastCall;
    expect(callData).toBeUndefined();

    expect(response.status).toBe(409);
    expect(response.headers['content-type']).toBe(
      'application/json; charset=utf-8'
    );
    expect(response.body).toEqual({
      code: 7,
    });
  });
});

describe('Verify the email by the code', () => {
  test('Verify the email by the code', async () => {
    const user = new User({
      username: 'test',
      email: 'user@test.com',
      verifiedEmail: false,
      connects: [],
      modes: [],
      loginIps: [],
      locale: 'en-US',
    });
    await user.save();

    const code = createVerifyEmailCode(user.id, user.email);

    const response = await supertest(server).get('/user/verify').query({
      code,
    });

    expect(response.status).toBe(200);
    expect(response.headers['content-type']).toBe(
      'application/json; charset=utf-8'
    );
    expect(response.body).toMatchObject({
      code: 0,
    });
    expect(response.body.data['token']).toBeDefined();

    const updatedUser = await User.findById(user.id);
    expect(updatedUser).toBeDefined();
    expect(updatedUser?.verifiedEmail).toBe(true);
  });

  test('Verify the email by the code and invalid code', async () => {
    const response = await supertest(server).get('/user/verify').query({
      code: 'invalid code',
    });

    expect(response.status).toBe(400);
    expect(response.headers['content-type']).toBe(
      'application/json; charset=utf-8'
    );
    expect(response.body).toEqual({
      code: 9,
    });
  });

  test('Verify the email by the code without the code', async () => {
    const response = await supertest(server).get('/user/verify');

    expect(response.status).toBe(400);
    expect(response.headers['content-type']).toBe(
      'application/json; charset=utf-8'
    );
    expect(response.body).toEqual({
      code: 9,
    });
  });
});

describe('Login via email and password', () => {
  test('Login via email and password', async () => {
    const hash = await passwordHash('password');

    const user = new User({
      username: 'test',
      email: 'user@test.com',
      verifiedEmail: true,
      passwordHash: hash,
      connects: [],
      modes: [],
      loginIps: [],
      locale: 'en-US',
    });
    await user.save();

    const response = await supertest(server).post('/user/login').send({
      email: 'user@test.com',
      password: 'password',
    });

    expect(response.status).toBe(200);
    expect(response.headers['content-type']).toBe(
      'application/json; charset=utf-8'
    );
    expect(response.body).toMatchObject({
      code: 0,
    });
    expect(response.body.data['token']).toBeDefined();
  });

  test('Login via email and password and the email is not verified', async () => {
    const hash = await passwordHash('password');

    const user = new User({
      username: 'test',
      email: 'user@test.com',
      verifiedEmail: false,
      passwordHash: hash,
      connects: [],
      modes: [],
      loginIps: [],
      locale: 'en-US',
    });
    await user.save();

    const response = await supertest(server).post('/user/login').send({
      email: 'user@test.com',
      password: 'password',
    });

    expect(response.status).toBe(403);
    expect(response.headers['content-type']).toBe(
      'application/json; charset=utf-8'
    );
    expect(response.body).toEqual({
      code: 11,
    });
  });

  test('Login via email and password and the user is not found', async () => {
    const response = await supertest(server).post('/user/login').send({
      email: 'user@test.com',
      password: 'password',
    });

    expect(response.status).toBe(404);
    expect(response.headers['content-type']).toBe(
      'application/json; charset=utf-8'
    );
    expect(response.body).toEqual({
      code: 5,
    });
  });

  test('Login via email and password and the password is incorrect', async () => {
    const hash = await passwordHash('password');

    const user = new User({
      username: 'test',
      email: 'user@test.com',
      verifiedEmail: true,
      passwordHash: hash,
      connects: [],
      modes: [],
      loginIps: [],
      locale: 'en-US',
    });
    await user.save();

    const response = await supertest(server).post('/user/login').send({
      email: 'user@test.com',
      password: 'incorrect password',
    });

    expect(response.status).toBe(401);
    expect(response.headers['content-type']).toBe(
      'application/json; charset=utf-8'
    );
    expect(response.body).toEqual({
      code: 10,
    });
  });

  test('Login via email and password and the email is not provided', async () => {
    const response = await supertest(server).post('/user/login').send({
      password: 'password',
    });

    expect(response.status).toBe(400);
    expect(response.headers['content-type']).toBe(
      'application/json; charset=utf-8'
    );
    expect(response.body).toEqual({
      code: 10,
    });
  });

  test('Login via email and password and the password is not provided', async () => {
    const response = await supertest(server).post('/user/login').send({
      email: 'user@test.com',
    });

    expect(response.status).toBe(400);
    expect(response.headers['content-type']).toBe(
      'application/json; charset=utf-8'
    );
    expect(response.body).toEqual({
      code: 10,
    });
  });
});
describe('Upload the user avatar', () => {
  test('Upload the user avatar', async () => {
    const user = new User({
      username: 'user 1',
      email: 'test@test.com',
      verifiedEmail: true,
      connects: [],
      modes: [],
      loginIps: [],
      locale: 'en-US',
    });

    await user.save();
    const token = user.generateJWTToken();

    const response = await supertest(server)
      .post('/user/avatar')
      .auth(token, { type: 'bearer' })
      .attach('avatarFile', fs.createReadStream('test/assets/logo.png'), {
        filename: 'avatar.png',
      });

    expect(response.status).toBe(200);
    expect(response.headers['content-type']).toBe(
      'application/json; charset=utf-8'
    );
    expect(response.body).toMatchObject({
      code: 0,
    });
  });

  test('Upload the user avatar & missing file', async () => {
    const user = new User({
      username: 'user 1',
      email: 'test@test.com',
      verifiedEmail: true,
      connects: [],
      modes: [],
      loginIps: [],
      locale: 'en-US',
    });

    await user.save();
    const token = user.generateJWTToken();

    const response = await supertest(server)
      .post('/user/avatar')
      .auth(token, { type: 'bearer' });

    expect(response.status).toBe(400);
    expect(response.headers['content-type']).toBe(
      'application/json; charset=utf-8'
    );
    expect(response.body).toMatchObject({
      code: 12,
    });
  });

  test('Upload the user avatar & invalid file', async () => {
    const user = new User({
      username: 'user 1',
      email: 'test@test.com',
      verifiedEmail: true,
      connects: [],
      modes: [],
      loginIps: [],
      locale: 'en-US',
    });

    await user.save();
    const token = user.generateJWTToken();

    const response = await supertest(server)
      .post('/user/avatar')
      .auth(token, { type: 'bearer' })
      .attach('avatarFile', Buffer.from([]), {
        filename: 'avatar.png',
      });

    expect(response.status).toBe(400);
    expect(response.headers['content-type']).toBe(
      'application/json; charset=utf-8'
    );
    expect(response.body).toMatchObject({
      code: 12,
    });
  });
});
