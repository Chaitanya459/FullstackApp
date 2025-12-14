import { Request } from 'express';
import { inject, injectable } from 'inversify';
import { BaseController } from '../../../../infra/http/BaseController';
import { DeleteUserUseCase } from './useCase';

@injectable()
export class DeleteUserController extends BaseController {
  public constructor(
    @inject(DeleteUserUseCase) private useCase: DeleteUserUseCase,
  ) {
    super();
  }

  public async executeImpl(req: Request) {
    const { id } = req.params;

    await this.useCase.execute(Number(id), req.user.id);
  }
}
