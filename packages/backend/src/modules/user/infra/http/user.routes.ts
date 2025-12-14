import express from 'express';
import { PermissionChecker } from '../../../../utils';
import { container } from '../../../../infra/di/inversify.config';
import { GetMeController } from '../../app/getUser/getMeController';
import { GetUserController } from '../../app/getUser/controller';
import { UpdateUserController } from '../../app/updateUser/controller';
import { DeleteUserController } from '../../app/deleteUser/controller';
import { RestoreUserController } from '../../app/restoreUser/controller';
import { SearchUsersController } from '../../app/searchUsers/controller';
import { CreateUserController } from '../../app/createUser/controller';

export const userRouter = express.Router();

const getMeController = container.get(GetMeController);
userRouter.get(`/me`, getMeController.execute);

const getUserController = container.get(GetUserController);
userRouter.get(
  `/:id`,
  PermissionChecker(`READ`, `USER`),
  getUserController.execute,
);

const updateUserController = container.get(UpdateUserController);
userRouter.put(
  `/:id`,
  PermissionChecker(`UPDATE`, `USER`),
  updateUserController.execute,
);

const deleteUserController = container.get(DeleteUserController);
userRouter.delete(
  `/:id`,
  PermissionChecker(`DELETE`, `USER`),
  deleteUserController.execute,
);

const restoreUserController = container.get(RestoreUserController);
userRouter.put(
  `/:id/restore`,
  PermissionChecker(`RESTORE`, `USER`),
  restoreUserController.execute,
);

const searchUsersController = container.get(SearchUsersController);
userRouter.get(
  `/`,
  PermissionChecker(`READ`, `USER`),
  searchUsersController.execute,
);

const createUserController = container.get(CreateUserController);
userRouter.post(
  `/`,
  PermissionChecker(`CREATE`, `USER`),
  createUserController.execute,
);
