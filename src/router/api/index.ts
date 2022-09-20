import { Router } from 'express';

import { Code, APIResponse } from '#';

const router = Router();

router.get('/', (_, res) => {
  new APIResponse(Code.OK, { message: 'Hello, World!' }).send(res);
});

export default router;
