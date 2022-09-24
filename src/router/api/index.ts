import { Router } from 'express';

import { ResponseStatusCode, sendResponse } from '#';

const router = Router();

router.get('/', (_, res) => {
  sendResponse(res, {
    code: ResponseStatusCode.SUCCESS,
    data: { message: 'Hello, World!' },
  });
});

export default router;
