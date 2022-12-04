import { Router } from 'express';
import * as userController from './controller';
import multer from 'multer';

const router = Router();
const upload = multer({ dest: '/uploads' });

router.get('/info', userController.getInfo);

router.get('/info/:userId', userController.getInfoByUserId);

router.patch('/info', userController.updateInfo);

router.post('/signup', userController.signup);

router.get('/verify', userController.verify);

router.post('/login', userController.login);

router.post('/avatar', upload.single('avatar'), userController.avatarUpload);

export { router as userRouter };
