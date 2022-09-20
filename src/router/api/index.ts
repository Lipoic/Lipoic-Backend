import { Router } from 'express';

import { StatusCode, APIResponse } from '#';

const router = Router();

router.get('/', (_, res) => {
  new APIResponse(StatusCode.OK, { message: 'Hello, World!' }).send(res);
});

export default router;
