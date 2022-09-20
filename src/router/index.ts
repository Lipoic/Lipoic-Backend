import { Router } from 'express';

import api from '#/api';
import { Code, APIResponse } from '#/util';

const router = Router();

router.use(api);
router.use((_, res) => {
  /* handle not found page error */
  new APIResponse(Code.NOT_FOUND).send(res);
});

export * from '#/util';
export default router;
