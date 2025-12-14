import { NextFunction, Request, RequestHandler, Response } from 'express';
import arrify from 'arrify';
import { Forbidden } from 'http-errors';
import { container } from '../infra/di/inversify.config';
import { PermissionCheckUseCase } from '../modules/user/app/checkPermission/useCase';

const permissionCheckUseCase = container.get(PermissionCheckUseCase);

export const PermissionChecker = (
  action: string,
  subject: string,
): RequestHandler => async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { user } = req;

    const hasPermission = await permissionCheckUseCase.execute({
      action,
      ids: arrify(user?.roleIds),
      subject,
    });

    if (!hasPermission) {
      throw new Forbidden(`Role does not have permission!`);
    }

    next();
  } catch (err) {
    next(err);
  }
};
