import { connect, Connection } from 'mongoose';

export default class Database {
  connection!: Connection;
}

export async function connectDatabase(
  dbName = 'lipoic_data'
): Promise<Database> {
  const url = process.env.DATABASE_URL ?? 'mongodb://localhost:27017';
  const username = process.env.DATABASE_USERNAME;
  const password = process.env.DATABASE_PASSWORD;

  const database = await connect(url, {
    dbName,
    auth: {
      username,
      password,
    },
    appName: 'Lipoic Backend',
    autoCreate: true,
    autoIndex: true,
  });

  return { connection: database.connection };
}
