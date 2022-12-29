import { ClassroomVisibility } from '@/model/classroom/classroom_visibility';

/**
 * The data of creating a classroom by a user.
 */
export interface CreateClassroomData {
  name: string;
  description: string;
  visibility: ClassroomVisibility;
}
