import { Code } from '@/router/code';
import { APIResponse } from '@/router/resopnse';
import { Router } from 'express';

const router = Router();

router.get('/', (_, res) => {
  new APIResponse(Code.ok, { message: 'Hello, World!' }).send(res);
});

router.use((_, res) => {
  new APIResponse(Code.not_found).send(res);
});

export default router;
