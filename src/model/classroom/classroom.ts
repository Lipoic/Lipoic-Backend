import { UserDocument } from '@/model/auth/user';
import { Model, Types, Schema, HydratedDocument, model } from 'mongoose';
import { ClassroomVisibility } from '@/model/classroom/classroom_visibility';
import {
  ClassroomMember,
  ClassroomMemberRole,
} from '@/model/classroom/classroom_member';

interface IClassroom {
  /**
   * The name of the classroom.
   * Limited to 100 characters.
   */
  name: string;
  /**
   * The description of the classroom.
   * Limited to 500 characters.
   */
  description: string;
  /**
   * The visibility of the classroom.
   */
  visibility: string;

  /**
   * The members of the classroom.
   */
  members: ClassroomMember[];

  /**
   * The owner of the classroom, and the unit is the user id.
   */
  owner: Types.ObjectId;

  /**
   * The date when the classroom is created.
   * Mongoose will automatically add this field.
   */
  createdAt?: Date;
  /**
   * The date when the classroom is updated.
   * Mongoose will automatically add this field.
   */
  updatedAt?: Date;
}

interface IClassroomMethods {
  /**
   * Get the owner user document of the classroom.
   */
  getOwner(): Promise<UserDocument>;
}

// eslint-disable-next-line @typescript-eslint/ban-types
type ClassroomModelType = Model<IClassroom, {}, IClassroomMethods>;

const classroomSchema = new Schema<
  IClassroom,
  ClassroomModelType,
  IClassroomMethods
>(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    visibility: {
      type: String,
      enum: ClassroomVisibility,
      required: true,
    },
    members: {
      type: [
        {
          id: {
            type: Schema.Types.ObjectId,
            required: true,
          },
          role: {
            type: String,
            enum: ClassroomMemberRole,
            required: true,
          },
        },
      ],
      required: true,
    },
    owner: {
      type: Schema.Types.ObjectId,
      required: true,
    },
  },
  { timestamps: true }
);

/**
 * The classroom database model.
 */
export const ClassroomModel = model<IClassroom, ClassroomModelType>(
  'classroom',
  classroomSchema,
  undefined,
  {
    overwriteModels: true,
  }
);

export const Classroom = ClassroomModel<IClassroom>;

/**
 * The document type of the classroom.
 */
export type ClassroomDocument = HydratedDocument<IClassroom, IClassroomMethods>;
