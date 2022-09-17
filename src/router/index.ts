import { Router } from 'express';
import api from '@/router/api';

const router = Router();

router.use('/', api);

export default router;
