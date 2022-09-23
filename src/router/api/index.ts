import { Router } from 'express';

import {
  ResponseStatusCode,
  createResponse,
  HttpStatusCode,
  sendResponse,
} from '#';

const router = Router();

router.get('/', (_, res) => {
  sendResponse(
    res,
    createResponse(HttpStatusCode.OK, ResponseStatusCode.SUCCESS, {
      message: 'hello, world.',
    })
  );
});

export default router;
