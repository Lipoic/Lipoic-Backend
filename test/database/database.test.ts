import { connectDatabase } from '@/database';
import { test, expect } from 'vitest';

test('Connect to the database', async () => {
  const db = await connectDatabase();
  expect(db).toBeDefined();

  await db.connection.close();
});

test('Connect to the database & check the database name', async () => {
  const db = await connectDatabase('test');
  expect(db).toBeDefined();
  expect(db.connection.getClient().options.dbName).toBe('test');

  await db.connection.close();
});
