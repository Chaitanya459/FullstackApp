import { Request, Response } from 'express';
import { injectable } from 'inversify';
import { BaseController } from '../../../../infra/http/BaseController';
import { SessionManager } from '../../../../utils';

@injectable()
export class LogoutController extends BaseController {
  public constructor() {
    super();
  }

  public async executeImpl(req: Request, res: Response) {
    await SessionManager.destroy(req);
    res.clearCookie(`spa_token`);
  }
}
