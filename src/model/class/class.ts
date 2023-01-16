import { UserDocument } from '@/model/auth/user';
import { Model, Types, Schema, HydratedDocument, model } from 'mongoose';
import { ClassVisibility } from '@/model/class/class_visibility';
import { ClassMember, ClassMemberRole } from '@/model/class/class_member';

interface IClass {
  /**
   * Limited to 100 characters.
   */
  name: string;

  /**
   * Limited to 500 characters.
   */
  description: string;

  visibility: string;

  members: ClassMember[];

  /**
   * The user ID of the owner of the class.
   * The default role of the owner is {@link ClassMemberRole.Teacher | teacher}.
   */
  owner: Types.ObjectId;

  /**
   * The users who are allowed to join the class by the owner.
   * Only used when the class visibility is {@link ClassVisibility.Private | private}.
   */
  allowJoinMembers?: Types.ObjectId[];

  /**
   * The time the class was created.
   * Automatically added by Mongoose.
   */
  createdAt?: Date;

  /**
   * The time the class was last updated.
   * Automatically added by Mongoose.
   */
  updatedAt?: Date;
}

interface IClassMethods {
  /**
   * Get the owner user document of the class.
   */
  getOwner(): Promise<UserDocument>;
}

// eslint-disable-next-line @typescript-eslint/ban-types
type ClassModelType = Model<IClass, {}, IClassMethods>;

const classSchema = new Schema<IClass, ClassModelType, IClassMethods>(
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
      enum: ClassVisibility,
      required: true,
    },
    owner: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    members: {
      type: [
        {
          userId: {
            type: Schema.Types.ObjectId,
            required: true,
          },
          role: {
            type: String,
            enum: ClassMemberRole,
            required: true,
          },
        },
      ],
      required: true,
    },
    allowJoinMembers: {
      type: [Types.ObjectId],
      required: false,
    },
  },
  { timestamps: true }
);

/**
 * The class database model.
 */
export const ClassModel = model<IClass, ClassModelType>(
  'class',
  classSchema,
  undefined,
  {
    overwriteModels: true,
  }
);

export const Class = ClassModel<IClass>;

/**
 * The document type of the class.
 */
export type ClassDocument = HydratedDocument<IClass, IClassMethods>;
