import { ClassroomVisibility } from '@/model/classroom/classroom_visibility';

export interface CreateClassroomData {
  name: string;
  description: string;
  visibility: ClassroomVisibility;
}
