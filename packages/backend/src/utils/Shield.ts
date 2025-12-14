import { RequestHandler } from 'express';
import { ITokenService } from '../modules/user/services/TokenService';
import { container } from '../infra/di/inversify.config';
import { SessionManager } from './SessionManager';

const tokenService: ITokenService = container.get(ITokenService);

export const Shield: RequestHandler = (req, res, next) => {
  try {
    const token = SessionManager.hasValidSession(req, res);
    req.user = tokenService.verify(token);

    next();
  } catch (err) {
    next(err);
  }
};
