import { Request } from 'express';
import { inject, injectable } from 'inversify';
import morphism, { createSchema } from 'morphism';
import { ResetPasswordDTO } from 'rsd';
import { BaseController } from '../../../../infra/http/BaseController';
import { UserMapper } from '../../mappers';
import { IResetPasswordInput, ResetPasswordUseCase } from './useCase';

@injectable()
export class ResetPasswordController extends BaseController {
  public constructor(
    @inject(ResetPasswordUseCase) private readonly useCase: ResetPasswordUseCase,
  ) {
    super();
  }

  private paramsMapper = createSchema<IResetPasswordInput, ResetPasswordDTO>({
    password: `password`,
    prt: `prt`,
  });

  public async executeImpl(req: Request) {
    const dto = morphism(this.paramsMapper, req.body);

    const resetPasswordResponse = await this.useCase.execute(dto);

    return resetPasswordResponse ?
        UserMapper.toDTO(resetPasswordResponse.user) :
      null;
  }
}
