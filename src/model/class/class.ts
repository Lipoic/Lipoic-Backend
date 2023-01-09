import { UserDocument } from '@/model/auth/user';
import { Model, Types, Schema, HydratedDocument, model } from 'mongoose';
import { ClassVisibility } from '@/model/class/class_visibility';
import { ClassMember, ClassMemberRole } from '@/model/class/class_member';

interface IClass {
  /**
   * The name of the class.
   * Limited to 100 characters.
   */
  name: string;
  /**
   * The description of the class.
   * Limited to 500 characters.
   */
  description: string;
  /**
   * The visibility of the class.
   */
  visibility: string;

  /**
   * The members of the class.
   */
  members: ClassMember[];

  /**
   * The owner of the class, and the unit is the user id.
   */
  owner: Types.ObjectId;

  /**
   * The date when the class is created.
   * Mongoose will automatically add this field.
   */
  createdAt?: Date;
  /**
   * The date when the class is updated.
   * Mongoose will automatically add this field.
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
    members: {
      type: [
        {
          id: {
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
    owner: {
      type: Schema.Types.ObjectId,
      required: true,
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
