import express from 'express';
import { GetGradeLevelsController } from '../../../reference/app/getGradeLevels/controller';
import { container } from '../../../../infra/di/inversify.config';

export const gradeLevelRouter = express.Router();

const getGradeLevelsController = container.get(GetGradeLevelsController);
gradeLevelRouter.get(
  `/`,
  getGradeLevelsController.execute,
);
