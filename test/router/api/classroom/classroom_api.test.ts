import { Express } from 'express-serve-static-core';
import { connectDatabase, Database } from '@/database';
import { describe, it, beforeAll, afterEach, beforeEach, expect } from 'vitest';
import { init } from '@/util/init';
import { createServer } from '@/util/server';
import supertest from 'supertest';
import { User } from '@/model/auth/user';

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

describe('Create a classroom', () => {
  it('Should create it successful', async () => {
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
      .post('/classroom')
      .auth(token, { type: 'bearer' })
      .send({
        name: 'Test classroom',
        description: 'This is a test classroom',
        visibility: 'NonPublic',
      });

    expect(response.status).toBe(200);
    expect(response.headers['content-type']).toBe(
      'application/json; charset=utf-8'
    );
    expect(response.body).toEqual({
      code: 0,
    });
  });

  it('Without authorization', async () => {
    const response = await supertest(server).post('/classroom').send({
      name: 'Test classroom',
      description: 'This is a test classroom',
      visibility: 'NonPublic',
    });

    expect(response.status).toBe(401);
    expect(response.headers['content-type']).toBe(
      'application/json; charset=utf-8'
    );
    expect(response.body).toEqual({
      code: 4,
    });
  });

  it('Should return 400 if name is too long', async () => {
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
      .post('/classroom')
      .auth(token, { type: 'bearer' })
      .send({
        name: 'A'.repeat(101),
        description: 'This is a test classroom',
        visibility: 'NonPublic',
      });

    expect(response.status).toBe(400);
    expect(response.headers['content-type']).toBe(
      'application/json; charset=utf-8'
    );
    expect(response.body).toEqual({
      code: 17,
    });
  });

  it('Should return 400 if description is too long', async () => {
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
      .post('/classroom')
      .auth(token, { type: 'bearer' })
      .send({
        name: 'Test classroom',
        description: 'A'.repeat(501),
        visibility: 'NonPublic',
      });

    expect(response.status).toBe(400);
    expect(response.headers['content-type']).toBe(
      'application/json; charset=utf-8'
    );
    expect(response.body).toEqual({
      code: 18,
    });
  });

  it('Should return 400 if visibility is invalid', async () => {
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
      .post('/classroom')
      .auth(token, { type: 'bearer' })
      .send({
        name: 'Test classroom',
        description: 'This is a test classroom',
        visibility: 'Invalid',
      });

    expect(response.status).toBe(400);
    expect(response.headers['content-type']).toBe(
      'application/json; charset=utf-8'
    );
    expect(response.body).toEqual({
      code: 15,
    });
  });

  it('Should return 400 if name is empty', async () => {
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
      .post('/classroom')
      .auth(token, { type: 'bearer' })
      .send({
        name: '',
        description: 'This is a test classroom',
        visibility: 'NonPublic',
      });

    expect(response.status).toBe(400);
    expect(response.headers['content-type']).toBe(
      'application/json; charset=utf-8'
    );
    expect(response.body).toEqual({
      code: 15,
    });
  });

  it('Should return 400 if description is empty', async () => {
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
      .post('/classroom')
      .auth(token, { type: 'bearer' })
      .send({
        name: 'Test classroom',
        description: '',
        visibility: 'NonPublic',
      });

    expect(response.status).toBe(400);
    expect(response.headers['content-type']).toBe(
      'application/json; charset=utf-8'
    );
    expect(response.body).toEqual({
      code: 15,
    });
  });

  it('Should return 400 if visibility is empty', async () => {
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
      .post('/classroom')
      .auth(token, { type: 'bearer' })
      .send({
        name: 'Test classroom',
        description: 'This is a test classroom',
      });

    expect(response.status).toBe(400);
    expect(response.headers['content-type']).toBe(
      'application/json; charset=utf-8'
    );
    expect(response.body).toEqual({
      code: 15,
    });
  });

  it('Should return 403 if user is not verified', async () => {
    const user = new User({
      username: 'test',
      email: 'test@test.com',
      verifiedEmail: false,
      connects: [],
      modes: [],
      loginIps: [],
      locale: 'en-US',
    });

    await user.save();

    const token = user.generateJWTToken();

    const response = await supertest(server)
      .post('/classroom')
      .auth(token, { type: 'bearer' })
      .send({
        name: 'Test classroom',
        description: 'This is a test classroom',
        visibility: 'NonPublic',
      });

    expect(response.status).toBe(403);
    expect(response.headers['content-type']).toBe(
      'application/json; charset=utf-8'
    );
    expect(response.body).toEqual({
      code: 16,
    });
  });
});
