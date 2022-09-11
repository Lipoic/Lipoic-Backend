import { IUser, userSchema } from '@/model/auth/user';
import * as mongoose from 'mongoose';
import type { Mongoose, Model } from 'mongoose';

export interface Database {
  client: Mongoose;
  user: Model<IUser>;
}

export async function connectDatabase(): Promise<Database> {
  const URI = process.env.DATABASE_URI;

  if (!URI) throw new Error(`Could not connect to database: no URI provided`);

  const client = await mongoose.connect(URI);
  const user = mongoose.model<IUser>('user', userSchema);

  return { client, user };
}
