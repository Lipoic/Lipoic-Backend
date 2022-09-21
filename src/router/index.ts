import { Router } from 'express';

import api from '#/api';
import {
  HttpStatusCode,
  ResponseStatusCode,
  CreateAPIResponse,
  APIResponseData,
  SendResponse,
} from '#/util';

const router = Router();

router.use(api);
router.use((_, res) => {
  /* handle not found page error */
  const responsePack: APIResponseData = CreateAPIResponse(
    ResponseStatusCode.NOT_FOUND,
    HttpStatusCode.NOT_FOUND,
    'Router not found.'
  );
  SendResponse(res, responsePack);
});

export * from '#/util';
export default router;
