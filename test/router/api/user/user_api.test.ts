import { createServer } from '@/util/server';
import {
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  test,
} from 'vitest';
import { Express } from 'express-serve-static-core';
import { init } from '@/util/init';
import Database, { connectDatabase } from '@/database';
import { User } from '@/model/auth/user';
import supertest from 'supertest';

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
        createdAt: user.createdAt.toISOString(),
        updatedAt: user.updatedAt.toISOString(),
      },
    });
  });

  test('Get the info of the current user and invalid token', async () => {
    const token = 'invalid token';

    const response = await supertest(server)
      .get('/user/info')
      .auth(token, { type: 'bearer' });

    expect(response.status).toBe(403);
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

  test('Get the info of the current user and no token', async () => {
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
        createdAt: user.createdAt.toISOString(),
        updatedAt: user.updatedAt.toISOString(),
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
