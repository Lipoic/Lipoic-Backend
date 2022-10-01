import { connectDatabase } from '@/database';
import { Types } from 'mongoose';
import { createJWTToken, verifyJWTToken } from '@/util/jwt';
import { describe, expect, test, beforeAll, beforeEach } from 'vitest';
import { User } from '@/model/auth/user';
import { findJWTKeys, init } from '@/util/init';
import jwt from 'jsonwebtoken';

beforeAll(async () => {
  init();
  await connectDatabase();
});

beforeEach(() => {
  findJWTKeys();
});

describe('Create JWT Token', () => {
  test('Create a token', () => {
    const user = new User({
      id: new Types.ObjectId(),
      username: 'test',
      email: 'test@test.com',
      verifiedEmail: true,
      connects: [],
      modes: [],
      loginIps: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const token = createJWTToken(user);

    expect(token).toBeDefined();
    expect(token.length).toBe(214);
  });

  test('Create a token without private key', () => {
    delete process.env.JWT_PRIVATE_KEY;

    const user = new User({
      id: new Types.ObjectId(),
      username: 'test',
      email: 'test@test.com',
      verifiedEmail: true,
      connects: [],
      modes: [],
      loginIps: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    expect(process.env.JWT_PRIVATE_KEY).toBeUndefined();
    expect(() => createJWTToken(user)).toThrowError('Missing JWT private key');
  });
});

describe('Verify JWT Token', () => {
  test('Verify a token', async () => {
    const user = new User({
      username: 'test',
      email: 'test@test.com',
      verifiedEmail: true,
      connects: [],
      modes: [],
      loginIps: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await user.save();

    const token = createJWTToken(user);

    expect(token).toBeDefined();
    expect(token.length).toBe(214);

    const verifyUser = await verifyJWTToken(token);

    expect(verifyUser).toBeDefined();
    expect(verifyUser).toBeInstanceOf(User);

    expect(verifyUser?.id).toBe(user.id);
    expect(verifyUser?.username).toBe(user.username);
    expect(verifyUser?.email).toBe(user.email);
    expect(verifyUser?.verifiedEmail).toBe(user.verifiedEmail);
    expect(verifyUser?.connects).toEqual(user.connects);
    expect(verifyUser?.modes).toEqual(user.modes);
    expect(verifyUser?.loginIps).toEqual(user.loginIps);
    expect(verifyUser?.createdAt).toEqual(user.createdAt);
    expect(verifyUser?.updatedAt).toEqual(user.updatedAt);

    await user.delete();
  });

  test('Verify a token without public key', async () => {
    delete process.env.JWT_PUBLIC_KEY;

    const user = new User({
      username: 'test',
      email: 'test@test.com',
      verifiedEmail: true,
      connects: [],
      modes: [],
      loginIps: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await user.save();

    const token = createJWTToken(user);

    expect(token).toBeDefined();
    expect(token.length).toBe(214);

    expect(process.env.JWT_PUBLIC_KEY).toBeUndefined();
    await expect(() => verifyJWTToken(token)).rejects.toThrowError(
      'Missing JWT public key'
    );

    await user.delete();
  });

  test('Verify a token with invalid token', async () => {
    const token = 'invalid token';
    const verifyUser = await verifyJWTToken(token);

    expect(verifyUser).toBeNull();
  });

  test('Verify a token with invalid payload', async () => {
    const privateKey = process.env.JWT_PRIVATE_KEY;

    expect(privateKey).toBeDefined();

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const token = jwt.sign({}, privateKey!, {
      algorithm: 'ES256',
      expiresIn: '7 days',
    });

    expect(token).toBeDefined();

    const verifyUser = await verifyJWTToken(token);
    expect(verifyUser).toBeNull();
  });

  test('Verify a token with invalid user', async () => {
    const user = new User({
      username: 'test',
      email: 'test@test.com',
      verifiedEmail: true,
      connects: [],
      modes: [],
      loginIps: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const token = createJWTToken(user);

    expect(token).toBeDefined();
    expect(token.length).toBe(214);

    const verifyUser = await verifyJWTToken(token);
    expect(verifyUser).toBeNull();
  });
});