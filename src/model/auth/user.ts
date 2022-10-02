import { HydratedDocument, Model, model, Schema, Types } from 'mongoose';
import { UserMode } from '@/model/auth/user_mode';
import { ConnectAccount, ConnectType } from '@/model/auth/connect_account';
import { createJWTToken } from '@/util/jwt';

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

interface IUserMethods {
  getPublicInfo: () => IPublicUser;
  generateJWTToken: () => string;
}

interface IPublicUser {
  id: string;
  username: string;
  verifiedEmail: boolean;
  modes: Types.Array<string>;
  createdAt: Date;
  updatedAt: Date;
}

// eslint-disable-next-line @typescript-eslint/ban-types
type UserModel = Model<IUser, {}, IUserMethods>;

const userSchema = new Schema<IUser, UserModel, IUserMethods>(
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

userSchema.method('getPublicInfo', function getPublicInfo(): IPublicUser {
  return {
    id: this.id,
    username: this.username,
    verifiedEmail: this.verifiedEmail,
    modes: this.modes,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
  };
});

userSchema.method('generateJWTToken', function generateJWTToken(): string {
  return createJWTToken(this.id);
});

export const User = model<IUser, UserModel>('user', userSchema);
export type UserDocument = HydratedDocument<IUser, IUserMethods>;
