import { StatusCode } from '@/router/status_code';
import { APIResponse } from '@/router/resopnse';
import { Router } from 'express';

const router = Router();

router.get('/', (_, res) => {
  new APIResponse(StatusCode.ok, { message: 'Hello, World!' }).send(res);
});

export default router;
