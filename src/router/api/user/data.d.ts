import { UserLocale } from '@/model/auth/user_locale';
import { UserMode } from '@/model/auth/user_mode';

/**
 * The data for editing user info.
 */
export interface EditUserInfoData {
  username?: string;
  modes?: UserMode[];
  locale?: UserLocale;
}

/**
 * The data for signing up user.
 */
export interface SignUpUserData {
  username: string;
  email: string;
  password: string;
  locale: UserLocale;
}

/**
 * The data for logging in user.
 */
export interface LoginUserData {
  email: string;
  password: string;
}
