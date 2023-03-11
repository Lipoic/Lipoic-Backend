import { Types } from 'mongoose';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { UserMode } from '@/model/auth/user_mode';

export interface ClassMember {
  /**
   * The user ID of the member.
   */
  userId: Types.ObjectId;
  /**
   * The role of the member.
   * @see ClassMemberRole
   */
  role: string;
}

/**
 * The role of a class member.
 * Note that this role is relative to the class and has nothing to do with {@link UserMode | the mode} set by the user.
 */
export enum ClassMemberRole {
  Teacher,
  Student,
}
