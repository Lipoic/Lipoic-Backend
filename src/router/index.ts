import { Router } from 'express';

import api from '#/api';
import { HttpStatusCode, ResponseStatusCode, sendResponse } from '#/util';

const router = Router();

router.use(api);
router.use((_, res) => {
  /* handle not found page error */
  sendResponse(
    res,
    { code: ResponseStatusCode.NOT_FOUND },
    HttpStatusCode.NOT_FOUND
  );
});

export * from '#/util';
export default router;
