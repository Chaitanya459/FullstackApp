import { Request } from 'express';
import { inject, injectable } from 'inversify';
import { BaseController } from '../../../../infra/http/BaseController';
import { UnlockUserUseCase } from './useCase';

@injectable()
export class UnlockUserController extends BaseController {
  public constructor(
    @inject(UnlockUserUseCase) private useCase: UnlockUserUseCase,
  ) {
    super();
  }

  public async executeImpl(req: Request) {
    const { id } = req.params;

    await this.useCase.execute(Number(id), req.user.id);
  }
}
