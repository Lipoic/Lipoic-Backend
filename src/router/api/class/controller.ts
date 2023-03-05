import { CreateClassData } from '@/router/api/class/data';
import { sendResponse, ResponseStatusCode, HttpStatusCode } from '#/util';
import { authMiddleware } from '@/router/util/util';
import { Request, Response } from 'express';
import { Class } from '@/model/class/class';
import { ClassVisibility } from '@/model/class/class_visibility';
import { getCharactersLength } from '@/util/util';
import { ClassMemberRole } from '@/model/class/class_member';

export const createClass = async (req: Request, res: Response) => {
  await authMiddleware(req, res);
  const user = req.user;

  if (!user) return;

  // If the user's email was not verified, send a response with status code 403.
  if (!user.verifiedEmail) {
    /*
     #swagger.responses[403] = {
        description: 'The user\'s email was not verified.',
        schema: {
          code: 16,
        }
     }
    */
    sendResponse(
      res,
      {
        code: ResponseStatusCode.EMAIL_NOT_VERIFIED,
      },
      HttpStatusCode.FORBIDDEN
    );
    return;
  }

  const body: CreateClassData = req.body;

  if (
    !body.name ||
    !body.description ||
    !body.visibility ||
    // Check if the visibility exists in ClassVisibility enum.
    !(body.visibility in ClassVisibility)
  ) {
    /*
      #swagger.responses[400] = {
        description: 'Missing or invalid parameters.',
        schema: {
          code: 15,
        }
      }
    */

    sendResponse(
      res,
      {
        code: ResponseStatusCode.MISSING_OR_INVALID_PARAMETERS,
      },
      HttpStatusCode.BAD_REQUEST
    );
    return;
  }

  if (getCharactersLength(body.name) > 100) {
    /*
      #swagger.responses[400] = {
        description: 'The class name is too long.',
        schema: {
          code: 17,
        }
      }
    */

    sendResponse(
      res,
      {
        code: ResponseStatusCode.CLASS_NAME_TOO_LONG,
      },
      HttpStatusCode.BAD_REQUEST
    );
    return;
  }

  if (getCharactersLength(body.description) > 500) {
    /*
      #swagger.responses[400] = {
        description: 'The class description is too long.',
        schema: {
          code: 18,
        }
      }
    */

    sendResponse(
      res,
      {
        code: ResponseStatusCode.CLASS_DESCRIPTION_TOO_LONG,
      },
      HttpStatusCode.BAD_REQUEST
    );
    return;
  }

  const aClass = new Class({
    name: body.name,
    description: body.description,
    visibility: ClassVisibility[body.visibility],
    members: [
      { userId: user.id, role: ClassMemberRole[ClassMemberRole.Teacher] },
    ],
    owner: user.id,
  });

  await aClass.save();

  /*
    #swagger.responses[200] = {
      description: 'Create a new class successfully.',
      schema: {
        code: 0,
      }
    }
  */
  sendResponse(res, { code: ResponseStatusCode.SUCCESS });
};

export const joinClass = async (req: Request, res: Response) => {
  await authMiddleware(req, res);
  const user = req.user;
  const classId = req.params.classId;

  if (!user) return;

  if (!user.verifiedEmail) {
    /*
      #swagger.responses[403] = {
        description: 'The user's email was not verified.',
        schema: {
          code: 16,
        },
      };
    */

    sendResponse(
      res,
      {
        code: ResponseStatusCode.EMAIL_NOT_VERIFIED,
      },
      HttpStatusCode.FORBIDDEN
    );
    return;
  }

  const aClass = await Class.findOne({ id: classId });

  const visibility = aClass?.visibility;
  const isPrivate = visibility === ClassVisibility[ClassVisibility.Private];
  const allowJoin =
    !isPrivate || (isPrivate && aClass?.allowJoinMembers?.includes(user.id));

  if (!aClass || allowJoin) {
    /*
      #swagger.responses[404] = {
        description:
          'The class does not exist or its owner does not allow the user to join it.',
        schema: {
          code: 19,
        },
      };
    */

    sendResponse(
      res,
      {
        code: ResponseStatusCode.NOT_FOUND,
      },
      HttpStatusCode.NOT_FOUND
    );
    return;
  }

  const isMember = aClass.members.some((e) => e.userId === user.id);

  if (isMember) {
    /*
      #swagger.responses[400] = {
        description: 'The user is already a member of the class.',
        schema: {
          code: 20,
        },
      };
    */

    sendResponse(
      res,
      {
        code: ResponseStatusCode.CLASS_ALREADY_MEMBER,
      },
      HttpStatusCode.BAD_REQUEST
    );
    return;
  }

  aClass.members.push({
    userId: user._id,
    role: ClassMemberRole[ClassMemberRole.Student],
  });
  await aClass.save();

  /*
    #swagger.responses[200] = {
      description: 'Join a class successfully.',
      schema: {
         code: 0,
      },
    };
  */

  sendResponse(res, { code: ResponseStatusCode.SUCCESS });
};
