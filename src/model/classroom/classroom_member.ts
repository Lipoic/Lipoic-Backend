import { Types } from 'mongoose';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { UserMode } from '@/model/auth/user_mode';

export interface ClassroomMember {
  /**
   * The user id of the member.
   */
  id: Types.ObjectId;
  /**
   * The role of the member.
   * @see ClassroomMemberRole
   */
  role: string;
}

/**
 * The role of a classroom member.
 * Note that this role is relative to the classroom and has nothing to do with {@link UserMode | the mode} set by the user.
 */
export enum ClassroomMemberRole {
  Teacher,
  Student,
}
