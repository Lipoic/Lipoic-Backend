import { Router } from 'express';
import * as userController from './controller';
import multer from 'multer';

const router = Router();
const upload = multer({ dest: '/uploads' });

router.get(
  /*
    #swagger.description = 'Get the info of the current user (authorization required)'
    #swagger.security = [{ "bearerAuth": [] }]
  */
  '/info',
  userController.getInfo
);

router.get(
  // #swagger.description = 'Get the user info by user id'
  '/info/:userId',
  userController.getInfoByUserId
);

router.patch(
  /*
    #swagger.description = 'Update the info of the current user (authorization required)'
    #swagger.security = [{ "bearerAuth": [] }]
  */
  '/info',
  userController.updateInfo
);

router.post(
  /*
    #swagger.description = 'Sign up a new user via email and password'
    #swagger.requestBody = {
      required: true,
      content: {
        'application/json': {
          schema: {
            $ref: '#/components/schemas/SignUpUserData',
          },
        },
      },
    }; 
  */
  '/signup',
  userController.signup
);

router.get(
  // #swagger.description = 'Verify the email account by the code'
  '/verify',
  userController.verify
);

router.post(
  /* 
    #swagger.description = 'Login via email and password'
    #swagger.requestBody = {
      required: true,
      content: {
        'application/json': {
          schema: {
            $ref: '#/components/schemas/LoginUserData',
          },
        },
      },
    };
  */
  '/login',
  userController.login
);

router.post(
  /*
    #swagger.description = 'Upload the avatar of the user (authorization required)'
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.parameters['avatarFile'] = {
            in: 'formData',
            type: 'file',
            required: 'true',
            description: 'The avatar file of the user',
      }
  */
  '/avatar',
  upload.single('avatarFile'),
  userController.uploadAvatar
);

router.get('/avatar', userController.downloadAvatar);

export { router as userRouter };
