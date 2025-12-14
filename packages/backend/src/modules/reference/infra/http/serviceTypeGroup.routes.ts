import { Router } from 'express';
import { container } from '../../../../infra/di/inversify.config';
import { GetServiceTypeGroupsController } from '../../app/getServiceTypeGroups/controller';

export const serviceTypeGroupRouter = Router();

const getServiceTypeGroupsController = container.get(GetServiceTypeGroupsController);
serviceTypeGroupRouter.get(`/`, getServiceTypeGroupsController.execute);
