import { createJWTToken } from '@/util/jwt';
import {
  UpdateUserInfoData,
  LoginUserData,
  SignUpUserData,
} from '#/api/user/data';
import { HttpStatusCode, ResponseStatusCode, sendResponse } from '#/util';
import { authMiddleware, getIp } from '#/util/util';
import { User } from '@/model/auth/user';
import { Request, Response } from 'express';
import { sendVerifyEmail } from '@/util/email';
import {
  checkVerifyEmailCode,
  createVerifyEmailCode,
  passwordHash,
  verifyPassword,
} from '#/api/user/util';

export const getInfo = async (req: Request, res: Response) => {
  /*
    #swagger.description = 'Get the info of the current user (authorization required)'
    #swagger.security = [{ "bearerAuth": [] }]
  */

  // This middleware will check the token and set the user info to req.user
  await authMiddleware(req, res);

  const user = req.user;

  if (user) {
    /* #swagger.responses[200] = {
      schema: {
        code: 0,
        data: { $ref: '#/components/schemas/AuthUser' },
      },
    }; */

    sendResponse(res, {
      code: ResponseStatusCode.SUCCESS,
      data: user.getAuthInfo(),
    });
  }
};

export const getInfoByUserId = async (req: Request, res: Response) => {
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
};

export const updateInfo = async (req: Request, res: Response) => {
  /*
    #swagger.description = 'Edit the info of the current user (authorization required)'
    #swagger.security = [{ "bearerAuth": [] }]
  */

  // This middleware will check the token and set the user info to req.user
  await authMiddleware(req, res);

  const user = req.user;

  if (user) {
    /*
    #swagger.requestBody = {
      required: true,
      content: {
        'application/json': {
          schema: {
            $ref: '#/components/schemas/EditUserInfoData',
          },
        },
      },
    };
    */

    const data: UpdateUserInfoData = req.body;
    const updateData = {
      username: data.username,
      modes: data.modes,
      locale: data.locale,
    };

    if (data.username) {
      updateData.username = data.username;
    }
    if (data.modes) {
      updateData.modes = data.modes;
    }
    if (data.locale) {
      updateData.locale = data.locale;
    }

    // Update the user info
    await User.updateOne(
      {
        id: user.id,
      },
      {
        $set: updateData,
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
          code: ResponseStatusCode.UPDATE_USER_INFO_ERROR,
        },
        HttpStatusCode.INTERNAL_SERVER_ERROR
      );
    }
  }
};

export const signup = async (req: Request, res: Response) => {
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

  const alreadyExistsAccount = await User.findOne({ email: data.email });

  let emailUsed = alreadyExistsAccount !== null;

  // If the email hasn't been verified, then delete the user and create a new one
  if (
    !alreadyExistsAccount?.verifiedEmail &&
    alreadyExistsAccount?.canSendVerifyEmail()
  ) {
    await alreadyExistsAccount?.delete();
    emailUsed = false;
  }

  if (!emailUsed) {
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

    await user.update({
      $set: {
        lastSentVerifyEmailTime: new Date(),
      },
    });

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
    return;
  }
};

export const verify = async (req: Request, res: Response) => {
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
    const token = createJWTToken(verifyUser.id);

    /* #swagger.responses[200] = {
      description: 'Success to verify the email',
      schema: {
        code: 0,
        data: {
          $ref: '#/components/schemas/AccessToken',
        }
      },
    }; */

    sendResponse(res, { code: ResponseStatusCode.SUCCESS, data: { token } });
  } else {
    /* #swagger.responses[400] = {
      description: 'The code is invalid or expired',
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
};

export const login = async (req: Request, res: Response) => {
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

  const data: LoginUserData = req.body;

  if (!data.email || !data.password) {
    /* #swagger.responses[400] = {
      description: 'Missing required fields',
      schema: {
        code: 10,
      },
    }; */

    sendResponse(
      res,
      {
        code: ResponseStatusCode.Login_User_Error,
      },
      HttpStatusCode.BAD_REQUEST
    );
    return;
  }

  const user = await User.findOne({ email: data.email });
  const passwordHash = user?.passwordHash;

  if (!user || !passwordHash) {
    /* #swagger.responses[404] = {
      description: 'The user is not found',
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
    return;
  } else {
    const passwordMatch = await verifyPassword(data.password, passwordHash);

    if (passwordMatch) {
      if (user.verifiedEmail) {
        await User.updateOne(
          {
            id: user.id,
          },
          {
            $addToSet: {
              loginIps: getIp(req),
            },
          }
        );
        const token = createJWTToken(user.id);

        /* #swagger.responses[200] = {
          description: 'Success to login',
          schema: {
            code: 0,
            data: {
              $ref: '#/components/schemas/AccessToken',
            },
          },
        }; */

        sendResponse(res, {
          code: ResponseStatusCode.SUCCESS,
          data: {
            token,
          },
        });
      } else {
        /* #swagger.responses[403] = {
          description: 'The email has not been verified',
          schema: {
            code: 11,
          },
        }; */

        sendResponse(
          res,
          {
            code: ResponseStatusCode.Login_User_Email_Not_Verified,
          },
          HttpStatusCode.FORBIDDEN
        );
      }
    } else {
      /* #swagger.responses[400] = {
        description: 'The password is incorrect',
        schema: {
          code: 10,
        },
      }; */

      sendResponse(
        res,
        {
          code: ResponseStatusCode.Login_User_Error,
        },
        HttpStatusCode.UNAUTHORIZED
      );
      return;
    }
  }
};
