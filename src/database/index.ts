import { connect, Connection } from 'mongoose';
import { GridFSBucket } from 'mongodb';

export class Database {
  connection!: Connection;
  avatarGfs!: GridFSBucket;
}

/**
 * Connect to the database.
 * @param dbName The database name (default: 'lipoic_data').
 * @returns The database instance.
 */
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

  return {
    connection: database.connection,
    avatarGfs: new GridFSBucket(database.connection.db, {
      bucketName: 'avatarFiles',
    }),
  };
}
