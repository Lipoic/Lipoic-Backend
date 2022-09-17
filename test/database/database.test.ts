import { connectDatabase } from '@/database';
import { init } from '@/util/init';
import { test, expect, beforeAll } from 'vitest';

beforeAll(() => init());

test('Connect to the database', async () => {
  const db = await connectDatabase();
  expect(db.connection).toBeDefined();

  await db.connection.close();
});

test('Connect to the database & check the database name', async () => {
  const db = await connectDatabase('test');
  expect(db.connection).toBeDefined();
  expect(db.connection.getClient().options.dbName).toBe('test');

  await db.connection.close();
});
