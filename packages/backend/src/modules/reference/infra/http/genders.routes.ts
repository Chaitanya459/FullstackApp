import express from 'express';
import { GetGendersController } from '../../../reference/app/getGenders/controller';
import { container } from '../../../../infra/di/inversify.config';

export const genderRouter = express.Router();

const getGendersController = container.get(GetGendersController);
genderRouter.get(
  `/`,
  getGendersController.execute,
);
