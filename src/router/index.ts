import { Router } from 'express';

import api from '#/api';
import {
  HttpStatusCode,
  ResponseStatusCode,
  createResponse,
  APIResponseData,
  sendResponse,
} from '#/util';

const router = Router();

router.use(api);
router.use((_, res) => {
  /* handle not found page error */
  const responsePack: APIResponseData<string> = createResponse(
    HttpStatusCode.NOT_FOUND,
    ResponseStatusCode.NOT_FOUND,
    'Router not found.'
  );
  sendResponse(res, responsePack);
});

export * from '#/util';
export default router;
