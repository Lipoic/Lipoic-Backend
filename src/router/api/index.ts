import { Router } from 'express';

import {
  ResponseStatusCode,
  CreateAPIResponse,
  HttpStatusCode,
  SendResponse,
} from '#';

const router = Router();

router.get('/', (_, res) => {
  SendResponse(
    res,
    CreateAPIResponse(ResponseStatusCode.SUCCESS, HttpStatusCode.OK, {
      message: 'hello, world.',
    })
  );
});

export default router;
