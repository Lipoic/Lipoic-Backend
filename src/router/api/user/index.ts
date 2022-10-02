import { HttpStatusCode, ResponseStatusCode, sendResponse } from '#/util';
import { authMiddleware } from '#/util/util';
import { User } from '@/model/auth/user';
import { Router } from 'express';

const router = Router();

router.get('/info', async (req, res, next) => {
  await authMiddleware(req, res, next);
  // #swagger.description = 'Get the info of the current user (authorization required)'
  // #swagger.security = [{ "bearerAuth": [] }]

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

export { router as userRouter };
