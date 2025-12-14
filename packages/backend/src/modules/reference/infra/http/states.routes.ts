import express from 'express';
import { container } from '../../../../infra/di/inversify.config';
import { GetStatesController } from '../../../reference/app/getStates/controller';

export const stateRouter = express.Router();

const getStatesController = container.get(GetStatesController);
stateRouter.get(
  `/`,
  getStatesController.execute,
);
