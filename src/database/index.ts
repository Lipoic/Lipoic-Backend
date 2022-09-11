import { IUser, userSchema } from '@/model/auth/user';
import * as mongoose from 'mongoose';

export default class Database {
  client!: typeof import('mongoose');
  user!: mongoose.Model<IUser>;
}

export async function connectDatabase(): Promise<Database> {
  const url = process.env.DATABASE_URL ?? 'mongodb://localhost:27017';
  const username = process.env.DATABASE_USERNAME;
  const password = process.env.DATABASE_PASSWORD;

  const client = await mongoose.connect(url, {
    dbName: 'lipoic_data',
    auth: {
      username,
      password,
    },
    appName: 'Lipoic Backend',
    autoCreate: true,
    autoIndex: true,
  });

  const user = mongoose.model<IUser>('user', userSchema);

  return { client, user };
}
