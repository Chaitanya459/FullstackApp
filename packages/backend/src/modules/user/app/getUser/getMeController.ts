import { Request } from 'express';
import { inject, injectable } from 'inversify';
import { BaseController } from '../../../../infra/http/BaseController';
import { UserMapper } from '../../mappers';
import { GetUserUseCase } from './useCase';

@injectable()
export class GetMeController extends BaseController {
  public constructor(
    @inject(GetUserUseCase) private useCase: GetUserUseCase,
  ) {
    super();
  }

  public async executeImpl(req: Request) {
    const user = await this.useCase.execute(req.user.id);

    return UserMapper.toDTO(user);
  }
}
