import { Router } from 'express';

import { ResponseStatusCode, sendResponse } from '#';
import { authenticationRouter } from '#/api/authentication';
import { userRouter } from '@/router/api/user';

export const apiRouter = Router();

apiRouter.get('/', (_, res) => {
  sendResponse(res, {
    code: ResponseStatusCode.SUCCESS,
    data: { message: 'Hello, World!' },
  });
});

apiRouter.use('/authentication', authenticationRouter);
apiRouter.use('/user', userRouter);
