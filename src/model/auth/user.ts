import { HydratedDocument, model, Schema, Types } from 'mongoose';
import { UserMode } from '@/model/auth/user_mode';
import { ConnectAccount, ConnectType } from '@/model/auth/connect_account';

interface IUser {
  username: string;
  email: string;
  verifiedEmail: boolean;
  passwordHash?: string;
  connects: Types.Array<ConnectAccount>;
  modes: Types.Array<string>;
  loginIps: Types.Array<string>;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    username: { type: String, required: true },
    email: { type: String, required: true },
    verifiedEmail: { type: Boolean, required: true },
    passwordHash: { type: String, required: false },
    connects: {
      type: [
        {
          accountType: {
            type: String,
            enum: Object.values(ConnectType),
            required: true,
          },
          name: { type: String, required: true },
          email: { type: String, required: true },
        },
      ],
      required: true,
    },
    modes: {
      type: [String],
      enum: Object.values(UserMode),
      required: true,
    },
    loginIps: { type: [String], required: true },
  },
  { timestamps: true }
);

export const User = model<IUser>('user', userSchema);
export type UserDocument = HydratedDocument<IUser>;
