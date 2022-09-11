import { model, Schema, Types } from 'mongoose';
import { UserMode } from '@/model/auth/user_mode';
import { ConnectAccount, ConnectType } from '@/model/auth/connect_account';

export interface IUser {
  username: string;
  email: string;
  verified_email: boolean;
  password_hash?: string;
  connects: Types.Array<ConnectAccount>;
  modes: Types.Array<string>;
  login_ips: Types.Array<string>;
  created_at: Date;
  updated_at: Date;
}

export const userSchema = new Schema<IUser>(
  {
    username: { type: String, required: true },
    email: { type: String, required: true },
    verified_email: { type: Boolean, required: true },
    password_hash: { type: String, required: false },
    connects: {
      type: [
        {
          account_type: {
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
    login_ips: { type: [String], required: true },
  },
  { timestamps: true }
);

export const User = model<IUser>('user', userSchema);
