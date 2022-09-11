import { model, Schema, Types } from 'mongoose';
import {
  LessonPermission,
  LessonPermissionType,
} from '@/model/lesson/lesson_permission';
import { LessonState } from '@/model/lesson/lesson_state';
import { User } from '@/model/auth/user';

export interface ILesson {
  name: string;
  description?: string;
  created_at: Date;
  updated_at: Date;
  create_by: Types.ObjectId;
  speakers: Types.ObjectId[];
  state: string;
  permission: LessonPermission;

  classroom_id?: Types.ObjectId;
}

export const lessonSchema = new Schema<ILesson>(
  {
    name: { type: String, required: true },
    description: { type: String, required: false },
    create_by: { type: Schema.Types.ObjectId, required: true, ref: User },
    speakers: { type: [Schema.Types.ObjectId], required: true, ref: User },
    state: { type: String, enum: Object.values(LessonState), required: true },
    permission: {
      type: {
        permission_type: {
          type: String,
          enum: Object.values(LessonPermissionType),
          required: true,
        },
        allows: { type: [Schema.Types.ObjectId], required: false, ref: User },
      },
      required: true,
    },
    classroom_id: { type: Schema.Types.ObjectId, required: false },
  },
  { timestamps: true }
);

export const Lesson = model<ILesson>('lesson', lessonSchema);
