import { getIp } from '#/util/util';
import { authenticationRouter } from '#/api/authentication';
import { Router } from 'express';

import { ResponseStatusCode, sendResponse } from '#';
import { userRouter } from '#/api/user';
import { classRouter } from '@/router/api/class';

export const apiRouter = Router();

apiRouter.get('/', (_, res) => {
  // #swagger.tags = ['Main']
  /* #swagger.responses[200] = {
    schema: {
      code: 0,
      data: { message: 'Hello, World!' },
    },
  }; */

  sendResponse(res, {
    code: ResponseStatusCode.SUCCESS,
    data: { message: 'Hello, World!' },
  });
});

apiRouter.get('/ip', (req, res) => {
  // #swagger.tags = ['Main']
  // #swagger.description = 'Get the ip address of the client'
  /* #swagger.responses[200] = {
    schema: {
      code: 0,
      data: {
        ip: 'your ip',
      },
    },
  }; */

  sendResponse(res, {
    code: ResponseStatusCode.SUCCESS,
    data: { ip: getIp(req) },
  });
});

apiRouter.use(
  '/authentication',
  authenticationRouter
  // #swagger.tags = ['Authentication']
);

apiRouter.use(
  '/user',
  userRouter
  // #swagger.tags = ['User']
);

apiRouter.use(
  '/class',
  classRouter
  // #swagger.tags = ['Class']
);
