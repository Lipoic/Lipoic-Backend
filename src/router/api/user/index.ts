import { EditUserInfoData } from '#/api/user/data';
import { HttpStatusCode, ResponseStatusCode, sendResponse } from '#/util';
import { authMiddleware } from '#/util/util';
import { User } from '@/model/auth/user';
import { Router } from 'express';

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
    };

    if (data.username) {
      editedData.username = data.username;
    }
    if (data.modes) {
      editedData.modes = data.modes;
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

export { router as userRouter };
