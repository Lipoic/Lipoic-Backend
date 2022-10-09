import { createJWTToken } from '@/util/jwt';
import { EditUserInfoData, SignUpUserData } from '#/api/user/data';
import { HttpStatusCode, ResponseStatusCode, sendResponse } from '#/util';
import { authMiddleware, getIp } from '#/util/util';
import { User } from '@/model/auth/user';
import { passwordHash } from '@/util/bcrypt';
import { Router } from 'express';
import { sendVerifyEmail } from '@/util/email';

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
    const code = createJWTToken(user.id, '10 minutes');

    await sendVerifyEmail(data.username, data.email, code, data.locale);

    /* #swagger.responses[200] = {
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

export { router as userRouter };
