import { Request, Response } from 'express';
import { LoginDTO } from 'rsd';
import { injectable } from 'inversify';
import morphism, { createSchema } from 'morphism';
import { BaseController } from '../../../../infra/http/BaseController';
import { SessionManager } from '../../../../utils';
import { UserMapper } from '../../mappers';
import { ILoginInput, LoginUseCase } from './useCase';

@injectable()
export class LoginController extends BaseController {
  public constructor(
    private readonly useCase: LoginUseCase,
  ) {
    super();
  }

  private paramsMapper = createSchema<ILoginInput, LoginDTO>({
    email: ({ username }) => username.trim().toLowerCase(),
    password: `password`,
  });

  public async executeImpl(req: Request, res: Response) {
    const dto = morphism(this.paramsMapper, req.body);

    const loginResponse = await this.useCase.execute(dto);

    SessionManager.setSession(req, loginResponse.token);
    res.cookie(`spa_token`, true);

    return UserMapper.toDTO(loginResponse.user);
  }
}
