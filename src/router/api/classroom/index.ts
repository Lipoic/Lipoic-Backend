import { Router } from 'express';
import * as classroomController from './controller';

const router = Router();

router.post(
  /**
   * #swagger.description = 'Create a new classroom'
   * #swagger.security = [{ "bearerAuth": [] }]
   */
  '/create',
  classroomController.createClassroom
);

export { router as classroomRouter };
