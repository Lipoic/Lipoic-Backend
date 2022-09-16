import { Types } from 'mongoose';

export interface LessonPermission {
  permission_type: string;
  allows?: Types.ObjectId[];
}

export enum LessonPermissionType {
  /// All users can access this lesson.
  All,
  /// Only users in the classroom can access this lesson.
  Classroom,
  /// Only users in the allows list can access this lesson.
  Select,
}
