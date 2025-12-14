import { Request } from 'express';
import { inject, injectable } from 'inversify';
import { PasswordResetRequestDTO } from 'rsd';
import morphism, { createSchema } from 'morphism';
import { BaseController } from '../../../../infra/http/BaseController';
import { IRequestPasswordResetInput, RequestPasswordResetUseCase } from './useCase';

@injectable()
export class RequestPasswordResetController extends BaseController {
  public constructor(
    @inject(RequestPasswordResetUseCase) private useCase: RequestPasswordResetUseCase,
  ) {
    super();
  }

  private paramsMapper = createSchema<IRequestPasswordResetInput, PasswordResetRequestDTO>({
    email: `email`,
  });

  public async executeImpl(req: Request) {
    const dto = morphism(this.paramsMapper, req.body);

    await this.useCase.execute(dto);
  }
}
