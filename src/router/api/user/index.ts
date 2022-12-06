import { Router } from 'express';
import * as userController from './controller';
import multer from 'multer';

const router = Router();

const avatarUpload = multer({
  // The file limits are set to 1MB
  limits: { fileSize: 1000000 },
});

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
  avatarUpload.single('avatarFile'),
  userController.uploadAvatar,
  userController.uploadAvatarError
);

router.get('/avatar/:userId', userController.downloadAvatar);

export { router as userRouter };
