import { Types } from 'mongoose';

export interface LessonPermission {
  permissionType: string;
  allows?: Types.ObjectId[];
}

export enum LessonPermissionType {
  /**
   * All users can access this lesson.
   */
  All,
  /**
   * Only users in the class can access this lesson.
   */
  Class,
  /**
   * Only users on the allow list can access this lesson.
   */
  Select,
}
