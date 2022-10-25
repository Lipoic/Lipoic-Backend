import { Router } from 'express';
import * as authController from './controller';

const router = Router();

router.get('/google/url', authController.googleAuth);

router.get('/facebook/url', authController.facebookAuth);

router.get('/google/callback', authController.googleAuthCallback);

router.get('/facebook/callback', authController.facebookAuthCallback);

export { router as authenticationRouter };
