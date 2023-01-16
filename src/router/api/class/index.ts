import { Router } from 'express';
import * as classController from '@/router/api/class/controller';

const router = Router();

router.post(
  /*
   #swagger.description = 'Create a new class (authorization required).'
   #swagger.security = [{ "bearerAuth": [] }]
   #swagger.requestBody = {
      required: true,
      content: {
        'application/json': {
          schema: {
            $ref: '#/components/schemas/CreateClassData',
          },
        },
      },
    };
   */
  '/',
  classController.createClass
);

router.post(
  /*
    #swagger.description = 'Join a class (authorization required).';
    #swagger.security = [{ "bearerAuth": [] }];
  */
  '/join/:classId',
  classController.joinClass
);

export { router as classRouter };
