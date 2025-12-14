import { Request } from 'express';
import { GetUserDTO } from 'rsd';
import { inject, injectable } from 'inversify';
import morphism, { createSchema } from 'morphism';
import { BaseController } from '../../../../infra/http/BaseController';
import { UserMapper } from '../../mappers';
import { ISearchUsersInput, SearchUsersUseCase } from './useCase';

@injectable()
export class SearchUsersController extends BaseController {
  public constructor(
    @inject(SearchUsersUseCase) private readonly useCase: SearchUsersUseCase,
  ) {
    super();
  }

  private paramsMapper = createSchema<ISearchUsersInput, GetUserDTO>({
    email: `email`,
    name: `name`,
    role: `role`,
    withDeleted: `withDeleted`,
    withPermissions: `withPermissions`,
  });

  public async executeImpl(req: Request) {
    const dto = morphism(this.paramsMapper, req.query);

    const users = await this.useCase.execute(dto);

    return users.map(UserMapper.toDTO);
  }
}
