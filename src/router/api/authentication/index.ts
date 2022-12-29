import { Router } from 'express';
import * as authController from '#/api/authentication/controller';

const router = Router();

router.get('/google/url', authController.googleOAuth);

router.get('/facebook/url', authController.facebookOAuth);

router.get('/google/callback', authController.googleOAuthCallback);

router.get('/facebook/callback', authController.facebookOAuthCallback);

export { router as authenticationRouter };
