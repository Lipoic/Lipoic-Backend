import { Code, APIResponse, Router } from '#';

const router = Router();

router.get('/', (_, res) => {
  new APIResponse(Code.OK, { message: 'Hello, World!' }).send(res);
});

export default router;
