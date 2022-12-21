import { Router } from 'express';
import * as classroomController from './controller';

const router = Router();

router.post(
  /*
   #swagger.description = 'Create a new classroom'
   #swagger.security = [{ "bearerAuth": [] }]
   #swagger.requestBody = {
      required: true,
      content: {
        'application/json': {
          schema: {
            $ref: '#/components/schemas/CreateClassroomData',
          },
        },
      },
    };
   */
  '/create',
  classroomController.createClassroom
);

export { router as classroomRouter };
