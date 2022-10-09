import { UserLocale } from '@/model/auth/user_locale';
import { UserMode } from '@/model/auth/user_mode';

export interface EditUserInfoData {
  username?: string;
  modes?: UserMode[];
  locale?: UserLocale;
}

export interface SignUpUserData {
  username: string;
  email: string;
  password: string;
  locale: UserLocale;
}
