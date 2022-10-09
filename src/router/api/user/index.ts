import { EditUserInfoData, SignUpUserData } from '#/api/user/data';
import { HttpStatusCode, ResponseStatusCode, sendResponse } from '#/util';
import { authMiddleware, getIp } from '#/util/util';
import { User } from '@/model/auth/user';
import { Router } from 'express';
import { sendVerifyEmail } from '@/util/email';
import {
  checkVerifyEmailCode,
  createVerifyEmailCode,
  passwordHash,
} from '#/api/user/util';

const router = Router();

router.get('/info', async (req, res) => {
  // #swagger.description = 'Get the info of the current user (authorization required)'
  // #swagger.security = [{ "bearerAuth": [] }]

  // This middleware will check the token and set the user info to req.user
  await authMiddleware(req, res);

  const user = req.user;

  if (user) {
    /* #swagger.responses[200] = {
      schema: {
        code: 0,
        data: { $ref: '#/components/schemas/User' },
      },
    }; */

    sendResponse(res, {
      code: ResponseStatusCode.SUCCESS,
      data: user.getPublicInfo(),
    });
  }
});

router.get('/info/:userId', async (req, res) => {
  // #swagger.description = 'Get the user info by user id'

  const id = req.params.userId;

  if (id) {
    const user = await User.findOne({ id });

    if (user) {
      /* #swagger.responses[200] = {
        schema: {
          code: 0,
          data: { $ref: '#/components/schemas/User' },
        },
      }; */

      sendResponse(res, {
        code: ResponseStatusCode.SUCCESS,
        data: user.getPublicInfo(),
      });
    } else {
      /* #swagger.responses[404] = {
        schema: {
          code: 5,
        },
      }; */

      sendResponse(
        res,
        {
          code: ResponseStatusCode.USER_NOT_FOUND,
        },
        HttpStatusCode.NOT_FOUND
      );
    }
  }
});

router.patch('/info', async (req, res) => {
  // #swagger.description = 'Edit the info of the current user (authorization required)'
  // #swagger.security = [{ "bearerAuth": [] }]

  // This middleware will check the token and set the user info to req.user
  await authMiddleware(req, res);

  const user = req.user;

  if (user) {
    /* #swagger.requestBody = {
      required: true,
      content: {
        'application/json': {
          schema: {
            $ref: '#/components/schemas/EditUserInfoData',
          },
        },
      },
    }; */

    const data: EditUserInfoData = req.body;
    const editedData = {
      username: data.username,
      modes: data.modes,
      locale: data.locale,
    };

    if (data.username) {
      editedData.username = data.username;
    }
    if (data.modes) {
      editedData.modes = data.modes;
    }
    if (data.locale) {
      editedData.locale = data.locale;
    }

    // Update the user info
    await User.updateOne(
      {
        id: user.id,
      },
      {
        $set: editedData,
        $addToSet: {
          loginIps: req.ip,
        },
      }
    );

    const result = await User.findOne({ id: user.id });

    if (result) {
      /* #swagger.responses[200] = {
      description: 'The user info has been updated.',
      schema: {
        code: 0,
        data: { $ref: '#/components/schemas/User' },
      },
    }; */

      sendResponse(res, {
        code: ResponseStatusCode.SUCCESS,
        data: result.getPublicInfo(),
      });
    } else {
      // If failed to update the user info

      /* #swagger.responses[500] = {
        schema: {
          code: 6,
        },
      }; */

      sendResponse(
        res,
        {
          code: ResponseStatusCode.EDIT_USER_INFO_ERROR,
        },
        HttpStatusCode.INTERNAL_SERVER_ERROR
      );
    }
  }
});

router.post('/signup', async (req, res) => {
  // #swagger.description = 'Sign up a new user via email and password'
  /* #swagger.requestBody = {
    required: true,
    content: {
      'application/json': {
        schema: {
          $ref: '#/components/schemas/SignUpUserData',
        },
      },
    },
  }; */

  const data: SignUpUserData = req.body;

  if (!data.username || !data.email || !data.password || !data.locale) {
    /* #swagger.responses[400] = {
      description: 'Missing required fields',
      schema: {
        code: 8,
      },
    }; */

    sendResponse(
      res,
      {
        code: ResponseStatusCode.Sign_Up_Error,
      },
      HttpStatusCode.BAD_REQUEST
    );
    return;
  }

  const accountAlreadyExists = await User.exists({ email: data.email });

  if (!accountAlreadyExists) {
    const hash = await passwordHash(data.password);

    const user = new User({
      username: data.username,
      email: data.email,
      verifiedEmail: false,
      passwordHash: hash,
      connects: [],
      modes: [],
      loginIps: [getIp(req)],
      locale: data.locale,
    });
    await user.save();

    // The verify email code.
    const code = createVerifyEmailCode(user.id, data.email);

    await sendVerifyEmail(data.username, data.email, code, data.locale);

    /* #swagger.responses[200] = {
      description: 'Success to sign up',
      schema: {
        code: 0,
      },
    }; */

    sendResponse(res, { code: ResponseStatusCode.SUCCESS });
  } else {
    /* #swagger.responses[409] = {
      description: 'The email has already been used',
      schema: {
        code: 7,
      },
    }; */

    sendResponse(
      res,
      { code: ResponseStatusCode.Sign_Up_Email_Already_Used },
      HttpStatusCode.CONFLICT
    );
  }
});

router.get('/verify', async (req, res) => {
  // #swagger.description = 'Verify the email account by the code'

  const code = req.query.code;

  if (typeof code !== 'string') {
    /* #swagger.responses[400] = {
      description: 'Missing required parameters',
      schema: {
        code: 9,
      },
    }; */

    sendResponse(
      res,
      {
        code: ResponseStatusCode.Verify_Email_Error,
      },
      HttpStatusCode.BAD_REQUEST
    );
    return;
  }

  const verifyUser = await checkVerifyEmailCode(code);

  if (verifyUser) {
    await User.updateOne(
      {
        id: verifyUser.id,
      },
      {
        $set: {
          verifiedEmail: true,
        },
      }
    );

    /* #swagger.responses[200] = {
      description: 'Success to verify the email',
      schema: {
        code: 0,
      },
    }; */

    sendResponse(res, { code: ResponseStatusCode.SUCCESS });
  } else {
    /* #swagger.responses[400] = {
      description: 'The code is invalid',
      schema: {
        code: 9,
      },
    }; */

    sendResponse(
      res,
      {
        code: ResponseStatusCode.Verify_Email_Error,
      },
      HttpStatusCode.BAD_REQUEST
    );
  }
});

export { router as userRouter };
