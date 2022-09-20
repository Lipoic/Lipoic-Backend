import { Router } from 'express';

import { Code, APIResponse, StatusCode } from '#';

const router = Router();

router.get('/', (_, res) => {
  new APIResponse(StatusCode.OK, Code.SUCCESS, {
    message: 'Hello, World!',
  }).send(res);
});

export default router;
