import { CreateClassroomData } from './data.d';
import { sendResponse, ResponseStatusCode, HttpStatusCode } from '#/util';
import { authMiddleware } from '@/router/util/util';
import { Request, Response } from 'express';
import { Classroom } from '@/model/classroom/classroom';

export const createClassroom = async (req: Request, res: Response) => {
  await authMiddleware(req, res);

  const user = req.user;

  if (!user) return;

  const body: CreateClassroomData = req.body;

  if (!body.name || !body.description || !body.visibility) {
    sendResponse(
      res,
      {
        code: ResponseStatusCode.MISSING_PARAMETERS,
      },
      HttpStatusCode.BAD_REQUEST
    );
    return;
  }

  const classroom = new Classroom({
    name: body.name,
    description: body.description,
    visibility: body.visibility,
    members: [],
    owner: user.id,
  });

  // TODO: 完成剩下的部分
  // TODO: 修改其他用於偵測不完整的請求參數或資料改為回傳 ResponseStatusCode.MISSING_PARAMETERS

  sendResponse(res, {
    code: ResponseStatusCode.SUCCESS,
  });
};
