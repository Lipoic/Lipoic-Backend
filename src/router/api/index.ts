import { Router } from 'express';

import { ResponseStatusCode, sendResponse } from '#';
import authenticationAPI from '#/api/authentication';
import userAPI from '#/api/user';

const router = Router();

router.get('/', (_, res) => {
  sendResponse(res, {
    code: ResponseStatusCode.SUCCESS,
    data: { message: 'Hello, World!' },
  });
});

router.use('/authentication', authenticationAPI);
router.use('/user', userAPI);

export default router;
