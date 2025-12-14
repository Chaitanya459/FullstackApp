import express from 'express';
import { container } from '../../../../infra/di/inversify.config';
import { GetServiceTypesController } from '../../app/getServiceTypes/controller';
import { GetServiceTypeReportController } from '../../app/getServiceTypeReport/controller';

export const serviceTypeRouter = express.Router();

const getServiceTypesController = container.get(GetServiceTypesController);
serviceTypeRouter.get(`/`, getServiceTypesController.execute);

const getServiceTypeReportController = container.get(GetServiceTypeReportController);
serviceTypeRouter.get(`/report`, getServiceTypeReportController.execute);
