import { Request } from 'express';
import { inject, injectable } from 'inversify';
import { BaseController } from '../../../../infra/http/BaseController';
import { RestoreUserUseCase } from './useCase';

@injectable()
export class RestoreUserController extends BaseController {
  public constructor(
    @inject(RestoreUserUseCase) private useCase: RestoreUserUseCase,
  ) {
    super();
  }

  public async executeImpl(req: Request) {
    const { id } = req.params;

    await this.useCase.execute(Number(id), req.user.id);
  }
}
