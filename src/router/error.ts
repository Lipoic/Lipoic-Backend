import { Router } from '.';

const router = Router();

router.all('*', (_req, res) => {
  res.status(404).json({ message: '404: Not Found', code: 0 });
});

export default router;
