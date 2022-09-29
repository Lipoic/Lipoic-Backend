import { getIp } from '@/router/util/util';
import { authenticationRouter } from '#/api/authentication';
import { Router } from 'express';

import { ResponseStatusCode, sendResponse } from '#';
import { userRouter } from '@/router/api/user';

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

apiRouter.use('/authentication', authenticationRouter);
apiRouter.use('/user', userRouter);
