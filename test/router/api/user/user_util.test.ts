import { passwordHash, verifyPassword } from '@/util/bcrypt';
import { compare } from 'bcrypt';
import { expect, test } from 'vitest';

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
