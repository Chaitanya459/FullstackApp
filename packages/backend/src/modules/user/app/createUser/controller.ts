import { Request } from 'express';
import { CreateUserDTO, UserDTO } from 'rsd';
import { inject, injectable } from 'inversify';
import morphism, { createSchema } from 'morphism';
import { BaseController } from '../../../../infra/http/BaseController';
import { UserMapper } from '../../mappers';
import { CreateUserUseCase, ICreateUserInput } from './useCase';

@injectable()
export class CreateUserController extends BaseController {
  public constructor(
    @inject(CreateUserUseCase) private readonly useCase: CreateUserUseCase,
  ) {
    super();
  }

  private paramsMapper = createSchema<ICreateUserInput, CreateUserDTO>({
    user: ({ user }) => UserMapper.toDomain(user as UserDTO),
  });

  public async executeImpl(req: Request) {
    const dto = morphism(this.paramsMapper, req.body);

    const user = await this.useCase.execute(dto, req.user.id);

    return UserMapper.toDTO(user);
  }
}
