import { CreateClassroomData } from '#/api/classroom/data.d';
import { sendResponse, ResponseStatusCode, HttpStatusCode } from '#/util';
import { authMiddleware } from '@/router/util/util';
import { Request, Response } from 'express';
import { Classroom } from '@/model/classroom/classroom';
import { ClassroomVisibility } from '@/model/classroom/classroom_visibility';
import { getCharactersLength } from '@/util/util';
import { ClassroomMemberRole } from '@/model/classroom/classroom_member';

export const createClassroom = async (req: Request, res: Response) => {
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

  const body: CreateClassroomData = req.body;

  if (
    !body.name ||
    !body.description ||
    !body.visibility ||
    // Check if the visibility exists in ClassroomVisibility enum.
    !(body.visibility in ClassroomVisibility)
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
        description: 'The classroom name is too long.',
        schema: {
          code: 17,
        }
      }
    */

    sendResponse(
      res,
      {
        code: ResponseStatusCode.CLASSROOM_NAME_TOO_LONG,
      },
      HttpStatusCode.BAD_REQUEST
    );
    return;
  }

  if (getCharactersLength(body.description) > 500) {
    /*
      #swagger.responses[400] = {
        description: 'The classroom description is too long.',
        schema: {
          code: 18,
        }
      }
    */

    sendResponse(
      res,
      {
        code: ResponseStatusCode.CLASSROOM_DESCRIPTION_TOO_LONG,
      },
      HttpStatusCode.BAD_REQUEST
    );
    return;
  }

  const classroom = new Classroom({
    name: body.name,
    description: body.description,
    visibility: ClassroomVisibility[body.visibility],
    members: [
      { id: user.id, role: ClassroomMemberRole[ClassroomMemberRole.Teacher] },
    ],
    owner: user.id,
  });

  await classroom.save();

  /*
    #swagger.responses[200] = {
      description: 'Create a new classroom successfully.',
      schema: {
        code: 0,
      }
    }
  */
  sendResponse(res, {
    code: ResponseStatusCode.SUCCESS,
  });
};
