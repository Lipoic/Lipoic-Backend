import Database, { connectDatabase } from '@/database';
import { createJWTToken, verifyJWTToken } from '@/util/jwt';
import {
  describe,
  expect,
  test,
  beforeAll,
  beforeEach,
  afterEach,
} from 'vitest';
import { User } from '@/model/auth/user';
import { findJWTKeys, init } from '@/util/init';
import jwt from 'jsonwebtoken';
import { UserLocale } from '@/model/auth/user_locale';

let db: Database;

beforeAll(async () => {
  db = await connectDatabase('test');
});

// Reset data after each test "important for test isolation"
beforeEach(() => {
  init();
  findJWTKeys();
});
afterEach(async () => await db.connection.dropDatabase());

describe('Create JWT Token', () => {
  test('Create a token', () => {
    const user = new User({
      username: 'test',
      email: 'test@test.com',
      verifiedEmail: true,
      connects: [],
      modes: [],
      loginIps: [],
      locale: UserLocale.AmericanEnglish,
    });

    const token = createJWTToken(user.id);

    expect(token).toBeDefined();
    expect(token.length).toBe(214);
  });

  test('Create a token without private key', () => {
    delete process.env.JWT_PRIVATE_KEY;

    const user = new User({
      username: 'test',
      email: 'test@test.com',
      verifiedEmail: true,
      connects: [],
      modes: [],
      loginIps: [],
      locale: UserLocale.AmericanEnglish,
    });

    expect(process.env.JWT_PRIVATE_KEY).toBeUndefined();
    expect(() => createJWTToken(user.id)).toThrowError(
      'Missing JWT private key'
    );
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
      locale: UserLocale.AmericanEnglish,
    });

    await user.save();

    const token = createJWTToken(user.id);

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
      locale: UserLocale.AmericanEnglish,
    });

    await user.save();

    const token = createJWTToken(user.id);

    expect(token).toBeDefined();
    expect(token.length).toBe(214);

    expect(process.env.JWT_PUBLIC_KEY).toBeUndefined();
    await expect(() => verifyJWTToken(token)).rejects.toThrowError(
      'Missing JWT public key'
    );

    await user.delete();
  });

  test('Verify a token and invalid token', async () => {
    const token = 'invalid token';
    const verifyUser = await verifyJWTToken(token);

    expect(verifyUser).toBeNull();
  });

  test('Verify a token and invalid payload', async () => {
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

  test('Verify a token and invalid user', async () => {
    const user = new User({
      username: 'test',
      email: 'test@test.com',
      verifiedEmail: true,
      connects: [],
      modes: [],
      loginIps: [],
      locale: UserLocale.AmericanEnglish,
    });

    const token = createJWTToken(user.id);

    expect(token).toBeDefined();
    expect(token.length).toBe(214);

    const verifyUser = await verifyJWTToken(token);
    expect(verifyUser).toBeNull();
  });
});
