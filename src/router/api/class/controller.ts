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
    members: [{ id: user.id, role: ClassMemberRole[ClassMemberRole.Teacher] }],
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
  sendResponse(res, {
    code: ResponseStatusCode.SUCCESS,
  });
};

export const joinClass = async (req: Request, res: Response) => {
  await authMiddleware(req, res);
  const user = req.user;
  const classId = req.params.classId;

  if (!user) return;

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

  const aClass = await Class.findById(classId);

  if (aClass) {
    const visibility = aClass.visibility;
  }
};
