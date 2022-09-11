import { Router } from 'express';
import API from './api';
import error from './error';

const router = Router();

router
  .use('/api', API)
  .get('/', (_req, res) => {
    res.json({ message: 'Hello, World!' });
  })
  .use(error);

export { Router };
export default router;
