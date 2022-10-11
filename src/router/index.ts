import { Router } from 'express';
import type { ErrorRequestHandler } from 'express';

import { apiRouter } from '#/api';
import { HttpStatusCode, ResponseStatusCode, sendResponse } from '#/util';

/**
 * The root router.
 */
const router = Router();

router.use(apiRouter);
router.use((_, res) => {
  /* Handle not found page error. */
  sendResponse(
    res,
    { code: ResponseStatusCode.NOT_FOUND },
    HttpStatusCode.NOT_FOUND
  );
});

// Error handling middleware.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  console.error(err);
};
router.use(errorHandler);

export * from '#/util';
export default router;
