import express from 'express';
import { container } from '../../../../infra/di/inversify.config';
import { LoginController } from '../../app/login/controller';
import { LogoutController } from '../../app/logout/LogoutController';
import { RequestPasswordResetController } from '../../app/requestPasswordReset/controller';
import { CheckPasswordResetController } from '../../app/resetPassword/checkController';
import { ResetPasswordController } from '../../app/resetPassword/controller';

export const authRouter = express.Router();

const loginController = container.get(LoginController);
authRouter.post(`/login`, loginController.execute);

const logoutController = container.get(LogoutController);
authRouter.post(`/logout`, logoutController.execute);

const requestPasswordResetController = container.get(RequestPasswordResetController);
authRouter.post(`/reset/password`, requestPasswordResetController.execute);

const checkPasswordResetController = container.get(CheckPasswordResetController);
authRouter.get(`/reset/password`, checkPasswordResetController.execute);

const resetPasswordController = container.get(ResetPasswordController);
authRouter.put(`/reset/password`, resetPasswordController.execute);
