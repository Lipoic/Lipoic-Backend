import { HydratedDocument, Model, model, Schema, Types } from 'mongoose';
import { UserMode } from '@/model/auth/user_mode';
import { ConnectAccount, ConnectType } from '@/model/auth/connect_account';
import { createJWTToken } from '@/util/jwt';
import { UserLocale } from '@/model/auth/user_locale';

interface IUser {
  username: string;
  email: string;
  verifiedEmail: boolean;
  passwordHash?: string;
  lastSentVerifyEmailTime: Date;
  connects: Types.Array<ConnectAccount>;
  modes: Types.Array<string>;
  loginIps: Types.Array<string>;
  locale: string;
  createdAt: Date;
  updatedAt: Date;
}

interface IUserMethods {
  getPublicInfo: () => IPublicUser;
  generateJWTToken: () => string;
  canSendVerifyEmail: () => boolean;
}

interface IPublicUser {
  id: string;
  username: string;
  verifiedEmail: boolean;
  modes: Types.Array<string>;
  locale: string;
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
    lastSentVerifyEmailTime: { type: Date, required: false },
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
    locale: { type: String, enum: Object.values(UserLocale), required: true },
  },
  { timestamps: true }
);

userSchema.method('getPublicInfo', function getPublicInfo(): IPublicUser {
  return {
    id: this.id,
    username: this.username,
    verifiedEmail: this.verifiedEmail,
    modes: this.modes,
    locale: this.locale,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
  };
});

userSchema.method('generateJWTToken', function generateJWTToken(): string {
  return createJWTToken(this.id);
});

userSchema.method('canSendVerifyEmail', function canSendVerifyEmail(): boolean {
  if (this.lastSentVerifyEmailTime) {
    const now = new Date();
    const diff = now.getTime() - this.lastSentVerifyEmailTime.getTime();

    // over 10 minutes
    return diff > 1000 * 60 * 10;
  } else {
    return true;
  }
});

export const User = model<IUser, UserModel>('user', userSchema, undefined, {
  overwriteModels: true,
});
export type UserDocument = HydratedDocument<IUser, IUserMethods>;
