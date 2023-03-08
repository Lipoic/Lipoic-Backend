import { Express } from 'express-serve-static-core';
import { connectDatabase, Database } from '@/database';
import { describe, it, beforeAll, afterEach, beforeEach, expect } from 'vitest';
import { init } from '@/util/init';
import { createServer } from '@/util/server';
import supertest from 'supertest';
import { User } from '@/model/auth/user';
import { Class } from '@/model/class/class';

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

describe('Create a class', () => {
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
      .post('/class')
      .auth(token, { type: 'bearer' })
      .send({
        name: 'Test class',
        description: 'This is a test class',
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
    const response = await supertest(server).post('/class').send({
      name: 'Test class',
      description: 'This is a test class',
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
      .post('/class')
      .auth(token, { type: 'bearer' })
      .send({
        name: 'A'.repeat(101),
        description: 'This is a test class',
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
      .post('/class')
      .auth(token, { type: 'bearer' })
      .send({
        name: 'Test class',
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
      .post('/class')
      .auth(token, { type: 'bearer' })
      .send({
        name: 'Test class',
        description: 'This is a test class',
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
      .post('/class')
      .auth(token, { type: 'bearer' })
      .send({
        name: '',
        description: 'This is a test class',
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
      .post('/class')
      .auth(token, { type: 'bearer' })
      .send({
        name: 'Test class',
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
      .post('/class')
      .auth(token, { type: 'bearer' })
      .send({
        name: 'Test class',
        description: 'This is a test class',
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
      .post('/class')
      .auth(token, { type: 'bearer' })
      .send({
        name: 'Test class',
        description: 'This is a test class',
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

describe('Join a class', () => {
  it('Anyone is able to join a public class', async () => {
    const ownerUser = new User({
      username: 'test',
      email: 'test@test.com',
      verifiedEmail: true,
      connects: [],
      modes: [],
      loginIps: [],
      locale: 'en-US',
    });
    await ownerUser.save();

    const aClass = new Class({
      name: 'Test class',
      description: 'This is a test class',
      visibility: 'Public',
      owner: ownerUser._id,
      members: [
        {
          userId: ownerUser._id,
          role: 'Teacher',
        },
      ],
    });
    await aClass.save();

    const user = new User({
      username: 'test2',
      email: 'test2@test.com',
      verifiedEmail: true,
      connects: [],
      modes: [],
      loginIps: [],
      locale: 'en-US',
    });
    await user.save();
    const token = user.generateJWTToken();

    const response = await supertest(server)
      .post(`/class/${aClass.id}/join`)
      .auth(token, { type: 'bearer' });

    expect(response.status).toBe(200);
    expect(response.headers['content-type']).toBe(
      'application/json; charset=utf-8'
    );
    expect(response.body).toEqual({
      code: 0,
    });

    const updatedClass = await Class.findOne({ _id: aClass._id });
    expect(updatedClass?.members[0]).toMatchObject({
      userId: ownerUser._id,
      role: 'Teacher',
      _id: expect.anything(),
    });
    expect(updatedClass?.members[1]).toMatchObject({
      userId: user._id,
      role: 'Student',
      _id: expect.anything(),
    });
    expect(updatedClass?.members).toHaveLength(2);
  });

  it('Return 401 if the user is not authenticated', async () => {
    const ownerUser = new User({
      username: 'test',
      email: 'test@test.com',
      verifiedEmail: true,
      connects: [],
      modes: [],
      loginIps: [],
      locale: 'en-US',
    });
    await ownerUser.save();

    const aClass = new Class({
      name: 'Test class',
      description: 'This is a test class',
      visibility: 'Public',
      owner: ownerUser._id,
      members: [
        {
          userId: ownerUser._id,
          role: 'Teacher',
        },
      ],
    });
    await aClass.save();

    const response = await supertest(server).post(`/class/${aClass.id}/join`);

    expect(response.status).toBe(401);
    expect(response.headers['content-type']).toBe(
      'application/json; charset=utf-8'
    );
    expect(response.body).toEqual({
      code: 4,
    });

    const updatedClass = await Class.findOne({ _id: aClass._id });
    expect(updatedClass?.members).toHaveLength(1);
  });

  it("Return 403 if the user's email is not verified", async () => {
    const ownerUser = new User({
      username: 'test',
      email: 'test@test.com',
      verifiedEmail: true,
      connects: [],
      modes: [],
      loginIps: [],
      locale: 'en-US',
    });
    await ownerUser.save();

    const aClass = new Class({
      name: 'Test class',
      description: 'This is a test class',
      visibility: 'Public',
      owner: ownerUser._id,
      members: [
        {
          userId: ownerUser._id,
          role: 'Teacher',
        },
      ],
    });
    await aClass.save();

    const user = new User({
      username: 'test2',
      email: 'test2@test.com',
      verifiedEmail: false,
      connects: [],
      modes: [],
      loginIps: [],
      locale: 'en-US',
    });
    await user.save();
    const token = user.generateJWTToken();

    const response = await supertest(server)
      .post(`/class/${aClass.id}/join`)
      .auth(token, { type: 'bearer' });

    expect(response.status).toBe(403);
    expect(response.headers['content-type']).toBe(
      'application/json; charset=utf-8'
    );
    expect(response.body).toEqual({
      code: 16,
    });

    const updatedClass = await Class.findOne({ _id: aClass._id });
    expect(updatedClass?.members).toHaveLength(1);
  });

  it('Return 404 if the class does not exist', async () => {
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
      .post('/class/abcd/join')
      .auth(token, { type: 'bearer' });

    expect(response.status).toBe(404);
    expect(response.headers['content-type']).toBe(
      'application/json; charset=utf-8'
    );
    expect(response.body).toEqual({
      code: 1,
    });
  });

  it('Return 400 if the user is already a member of the class', async () => {
    // Arrange
    const ownerUser = new User({
      username: 'test',
      email: 'test@test.com',
      verifiedEmail: true,
      connects: [],
      modes: [],
      loginIps: [],
      locale: 'en-US',
    });
    await ownerUser.save();
    const user = new User({
      username: 'test2',
      email: 'test2@test.com',
      verifiedEmail: true,
      connects: [],
      modes: [],
      loginIps: [],
      locale: 'en-US',
    });
    await user.save();

    const aClass = new Class({
      name: 'Test class',
      description: 'This is a test class',
      visibility: 'Public',
      owner: ownerUser._id,
      members: [
        {
          userId: ownerUser._id,
          role: 'Teacher',
        },
        {
          userId: user._id,
          role: 'Student',
        },
      ],
    });
    await aClass.save();

    const token = user.generateJWTToken();

    // Act
    const response = await supertest(server)
      .post(`/class/${aClass.id}/join`)
      .auth(token, { type: 'bearer' });

    // Assert
    expect(response.status).toBe(400);
    expect(response.headers['content-type']).toBe(
      'application/json; charset=utf-8'
    );
    expect(response.body).toEqual({ code: 20 });
  });
});
