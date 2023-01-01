import { User } from '@/model/auth/user';
import {
  checkVerifyEmailCode,
  createVerifyEmailCode,
  passwordHash,
  verifyPassword,
} from '#/api/user/util';
import { compare } from 'bcrypt';
import {
  expect,
  test,
  describe,
  beforeAll,
  afterEach,
  beforeEach,
} from 'vitest';
import jwt from 'jsonwebtoken';
import { Database, connectDatabase } from '@/database';
import { init } from '@/util/init';

let db: Database;

beforeAll(async () => {
  db = await connectDatabase('test');
});

// Reset data after each test "important for test isolation"
beforeEach(() => {
  init();
});
afterEach(async () => await db.connection.dropDatabase());

test('Hash the password', async () => {
  const password = '123456';

  const hash = await passwordHash(password);
  expect(hash).toBeDefined();

  const result = await compare(password, hash);

  expect(result).toBe(true);
});

test('Verify the password with the hash', async () => {
  const password = '123456';
  const hash = await passwordHash(password);
  expect(hash).toBeDefined();

  const result = await verifyPassword(password, hash);

  expect(result).toBe(true);
});

describe('Create verify email code', () => {
  test('Create a code', () => {
    const user = new User({
      username: 'test',
      email: 'user@test.com',
      verifiedEmail: false,
      connects: [],
      modes: [],
      loginIps: [],
      locale: 'en-US',
    });

    const token = createVerifyEmailCode(user.id, user.email);

    expect(token).toBeDefined();
  });

  test('Create a code without private key', () => {
    delete process.env.JWT_PRIVATE_KEY;

    const user = new User({
      username: 'test',
      email: 'user@test.com',
      verifiedEmail: false,
      connects: [],
      modes: [],
      loginIps: [],
      locale: 'en-US',
    });

    expect(process.env.JWT_PRIVATE_KEY).toBeUndefined();
    expect(() => createVerifyEmailCode(user.id, user.email)).toThrowError(
      'Missing JWT private key'
    );
  });
});

describe('Check verify email code', () => {
  test('Check a code', async () => {
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

    expect(code).toBeDefined();

    const verifyUser = await checkVerifyEmailCode(code);

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
  });

  test('Check a code without public key', async () => {
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
    expect(code).toBeDefined();

    delete process.env.JWT_PUBLIC_KEY;
    expect(process.env.JWT_PUBLIC_KEY).toBeUndefined();
    await expect(() => checkVerifyEmailCode(code)).rejects.toThrowError(
      'Missing JWT public key'
    );
  });

  test('Check a code and invalid code', async () => {
    const code = 'invalid code';
    const verifyUser = await checkVerifyEmailCode(code);

    expect(verifyUser).toBeNull();
  });

  test('Check a code and invalid payload', async () => {
    const privateKey = process.env.JWT_PRIVATE_KEY;

    expect(privateKey).toBeDefined();

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const code = jwt.sign({}, privateKey!, {
      algorithm: 'ES256',
      expiresIn: '10 minutes',
    });

    expect(code).toBeDefined();

    const verifyUser = await checkVerifyEmailCode(code);
    expect(verifyUser).toBeNull();
  });

  test('Check a code and invalid user', async () => {
    const user = new User({
      username: 'test',
      email: 'user@test.com',
      verifiedEmail: false,
      connects: [],
      modes: [],
      loginIps: [],
      locale: 'en-US',
    });

    const code = createVerifyEmailCode(user.id, user.email);
    expect(code).toBeDefined();

    const verifyUser = await checkVerifyEmailCode(code);
    expect(verifyUser).toBeNull();
  });

  test('Check a code and invalid email', async () => {
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

    const code = createVerifyEmailCode(user.id, 'invalid email');
    expect(code).toBeDefined();

    const verifyUser = await checkVerifyEmailCode(code);
    expect(verifyUser).toBeNull();
  });
});
