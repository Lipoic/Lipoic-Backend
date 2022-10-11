import { HydratedDocument, model, Schema, Types } from 'mongoose';
import {
  LessonPermission,
  LessonPermissionType,
} from '@/model/lesson/lesson_permission';
import { LessonState } from '@/model/lesson/lesson_state';
import { UserModel } from '@/model/auth/user';

interface ILesson {
  name: string;
  description?: string;
  createBy: Types.ObjectId;
  speakers: Types.ObjectId[];
  state: string;
  permission: LessonPermission;

  classroomId?: Types.ObjectId;

  /**
   * The date when the lesson is created.
   * Mongoose will automatically add this field.
   */
  createdAt: Date;

  /**
   * The date when the lesson is updated.
   * Mongoose will automatically add this field.
   */
  updatedAt: Date;
}

const lessonSchema = new Schema<ILesson>(
  {
    name: { type: String, required: true },
    description: { type: String, required: false },
    createBy: { type: Schema.Types.ObjectId, required: true, ref: UserModel },
    speakers: { type: [Schema.Types.ObjectId], required: true, ref: UserModel },
    state: { type: String, enum: Object.values(LessonState), required: true },
    permission: {
      type: {
        permissionType: {
          type: String,
          enum: Object.values(LessonPermissionType),
          required: true,
        },
        allows: {
          type: [Schema.Types.ObjectId],
          required: false,
          ref: UserModel,
        },
      },
      required: true,
    },
    classroomId: { type: Schema.Types.ObjectId, required: false },
  },
  { timestamps: true }
);

/**
 * The lesson database model.
 */
export const LessonModel = model<ILesson>('lesson', lessonSchema, undefined, {
  overwriteModels: true,
});

export const Lesson = LessonModel<ILesson>;
/**
 * The document type of the lesson.
 */
export type LessonDocument = HydratedDocument<ILesson>;
