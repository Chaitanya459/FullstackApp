import express from 'express';
import { PermissionChecker } from '../../../../utils';
import { container } from '../../../../infra/di/inversify.config';
import { GetRolesController } from '../../app/getRoles/controller';

export const roleRouter = express.Router();

const getRolesController = container.get(GetRolesController);
roleRouter.get(
  `/`,
  PermissionChecker(`READ`, `ROLE`),
  getRolesController.execute,
);
