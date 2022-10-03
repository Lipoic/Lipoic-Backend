import { UserMode } from '@/model/auth/user_mode';

export interface EditUserInfoData {
  username?: string;
  modes?: UserMode[];
}
