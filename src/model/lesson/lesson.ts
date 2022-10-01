import { HydratedDocument, model, Schema, Types } from 'mongoose';
import {
  LessonPermission,
  LessonPermissionType,
} from '@/model/lesson/lesson_permission';
import { LessonState } from '@/model/lesson/lesson_state';
import { User } from '@/model/auth/user';

interface ILesson {
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
  createBy: Types.ObjectId;
  speakers: Types.ObjectId[];
  state: string;
  permission: LessonPermission;

  classroomId?: Types.ObjectId;
}

const lessonSchema = new Schema<ILesson>(
  {
    name: { type: String, required: true },
    description: { type: String, required: false },
    createBy: { type: Schema.Types.ObjectId, required: true, ref: User },
    speakers: { type: [Schema.Types.ObjectId], required: true, ref: User },
    state: { type: String, enum: Object.values(LessonState), required: true },
    permission: {
      type: {
        permissionType: {
          type: String,
          enum: Object.values(LessonPermissionType),
          required: true,
        },
        allows: { type: [Schema.Types.ObjectId], required: false, ref: User },
      },
      required: true,
    },
    classroomId: { type: Schema.Types.ObjectId, required: false },
  },
  { timestamps: true }
);

export const Lesson = model<ILesson>('lesson', lessonSchema);
export type LessonDocument = HydratedDocument<ILesson>;
