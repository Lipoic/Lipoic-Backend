import { Router } from 'express';
import * as userController from './controller';



const router = Router();



router.get('/info', userController.getInfo);

router.get('/info/:userId', userController.getInfoByUserId);

router.patch('/info', userController.updateInfo);

router.post('/signup', userController.signup);

router.get('/verify', userController.verify);

router.post('/login', userController.login);



export { router as userRouter };
