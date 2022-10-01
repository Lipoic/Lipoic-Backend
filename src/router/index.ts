import { NextFunction, Response, Router } from 'express';
import { ErrorRequestHandler } from 'express-serve-static-core';

import { apiRouter } from '#/api';
import { HttpStatusCode, ResponseStatusCode, sendResponse } from '#/util';

const router = Router();

router.use(apiRouter);
router.use((_, res) => {
  /* handle not found page error */
  sendResponse(
    res,
    { code: ResponseStatusCode.NOT_FOUND },
    HttpStatusCode.NOT_FOUND
  );
});

// Error handling
router.use<ErrorRequestHandler>(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  (err: unknown, _req: unknown, _res: Response, _next: NextFunction) => {
    console.error(err);
  }
);

export * from '#/util';
export default router;
