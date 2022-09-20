import { Router } from 'express';

import api from '#/api';
import { StatusCode, Code, APIResponse } from '#/util';

const router = Router();

router.use(api);
router.use((_, res) => {
  /* handle not found page error */
  new APIResponse(StatusCode.NOT_FOUND, Code.NOT_FOUND).send(res);
});

export * from '#/util';
export default router;
