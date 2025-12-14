import { Router } from 'express';
import { container } from '../../../../infra/di/inversify.config';
import { GetAcademicYearsController } from '../../app/getAcademicYears/controller';
import { GetAcademicYearByIdController } from '../../app/getAcademicYearById/controller';

export const academicYearRouter = Router();

const getAcademicYearsController = container.get(GetAcademicYearsController);
academicYearRouter.get(`/`, getAcademicYearsController.execute);

const getAcademicYearByIdController = container.get(GetAcademicYearByIdController);
academicYearRouter.get(`/:id`, getAcademicYearByIdController.execute);
