import { ClassVisibility } from '@/model/class/class_visibility';

/**
 * The data of creating a class by a user.
 */
export interface CreateClassData {
  name: string;
  description: string;
  visibility: ClassVisibility;
}
