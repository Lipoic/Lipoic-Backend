import { HydratedDocument, Model, model, Schema } from 'mongoose';
import { UserMode } from '@/model/auth/user_mode';
import { ConnectAccount, ConnectType } from '@/model/auth/connect_account';
import { createJWTToken } from '@/util/jwt';
import { UserLocale, USER_LOCALES } from '@/model/auth/user_locale';

interface IUser {
  username: string;
  email: string;
  verifiedEmail: boolean;
  passwordHash?: string;
  lastSentVerifyEmailTime?: Date;
  connects: ConnectAccount[];
  modes: string[];
  loginIps: string[];
  locale: string;
  avatar?: Buffer;

  /**
   * The date when the user is created.
   * Mongoose will automatically add this field.
   */
  createdAt?: Date;
  /**
   * The date when the user is updated.
   * Mongoose will automatically add this field.
   */
  updatedAt?: Date;
}

interface IUserMethods {
  /**
   * Get the public user information (without privacy information).
   */
  getPublicInfo: () => IPublicUser;

  /**
   * Get the authenticated user information.
   */
  getAuthInfo: () => IAuthUser;

  /**
   * Get the auth jwt token.
   */
  generateJWTToken: () => string;

  /**
   * Is it now possible to send a verification email.
   * Used to prevent mass spam emails.
   */
  canSendVerifyEmail: () => boolean;
}

/**
 * The public user information.
 */
interface IPublicUser {
  id: string;
  username: string;
  verifiedEmail: boolean;
  modes: UserMode[];
  locale: UserLocale;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * The authenticated user information.
 */
interface IAuthUser extends IPublicUser {
  email: string;
  connects: ConnectAccount[];
}

// eslint-disable-next-line @typescript-eslint/ban-types
type UserModelType = Model<IUser, {}, IUserMethods>;

const userSchema = new Schema<IUser, UserModelType, IUserMethods>(
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
            enum: ConnectType,
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
      enum: UserMode,
      required: true,
    },
    loginIps: { type: [String], required: true },
    locale: { type: String, enum: USER_LOCALES, required: true },
    avatar: { type: Buffer, required: false },
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

userSchema.method('getAuthInfo', function getAuthInfo(): IAuthUser {
  return {
    ...this.getPublicInfo(),
    email: this.email,
    connects: this.connects,
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

/**
 * The user database model.
 */
export const UserModel = model<IUser, UserModelType>(
  'user',
  userSchema,
  undefined,
  {
    overwriteModels: true,
  }
);

export const User = UserModel<IUser>;

/**
 * The document type of the user.
 */
export type UserDocument = HydratedDocument<IUser, IUserMethods>;
