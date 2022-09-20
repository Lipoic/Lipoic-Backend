import { Router } from 'express';

import api from './api';
import { Code, APIResponse } from './utils';

const router = Router();

router.use(api).use((_, res) => {
  /* 404 error response */
  new APIResponse(Code.NOT_FOUND).send(res);
});

export * from './utils';
export default router;
