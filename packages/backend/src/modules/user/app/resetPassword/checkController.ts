import { Request } from 'express';
import { injectable } from 'inversify';
import { BaseController } from '../../../../infra/http/BaseController';
import { ResetPasswordUseCase } from './useCase';

@injectable()
export class CheckPasswordResetController extends BaseController {
  public constructor(
    private readonly useCase: ResetPasswordUseCase,
  ) {
    super();
  }

  public executeImpl(req: Request) {
    const { prt } = req.query as { prt: string };

    const resetToken = this.useCase.getDecodedToken(prt);

    return resetToken;
  }
}
