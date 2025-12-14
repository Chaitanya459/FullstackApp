import { Router } from 'express';
import { PermissionChecker } from '../../../../utils/PermissionChecker';

import { container } from '../../../../infra/di/inversify.config';
import { GetStudentsController } from '../../app/getStudents/controller';
import { GetStudentByIdController } from '../../app/getStudentById/controller';
import { GetStudentSummaryController } from '../../app/getStudentSummary/controller';
import { GetStudentMonthlySummaryController } from '../../app/getStudentMonthlySummary/controller';

export const studentRouter = Router();

const getStudentsController = container.get(GetStudentsController);
studentRouter.get(
  `/`,
  PermissionChecker(`READ`, `STUDENT`),
  getStudentsController.execute,
);

const getStudentSummaryController = container.get(GetStudentSummaryController);
studentRouter.get(
  `/summary`,
  PermissionChecker(`READ`, `STUDENT`),
  getStudentSummaryController.execute,
);

const getStudentMonthlySummaryController = container.get(GetStudentMonthlySummaryController);
studentRouter.get(`/monthly-summary`, getStudentMonthlySummaryController.execute);

const getStudentByIdController = container.get(GetStudentByIdController);
studentRouter.get(
  `/:id`,
  PermissionChecker(`READ`, `STUDENT`),
  getStudentByIdController.execute,
);
