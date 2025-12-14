import { Request } from 'express';
import { UpdateUserDTO, UserDTO } from 'rsd';
import { inject, injectable } from 'inversify';
import morphism, { createSchema } from 'morphism';
import { BaseController } from '../../../../infra/http/BaseController';
import { UserMapper } from '../../mappers';
import { IUpdateUserInput, UpdateUserUseCase } from './useCase';

@injectable()
export class UpdateUserController extends BaseController {
  public constructor(
    @inject(UpdateUserUseCase) private readonly useCase: UpdateUserUseCase,
  ) {
    super();
  }

  private paramsMapper = createSchema<IUpdateUserInput, UpdateUserDTO>({
    id: `id`,
    user: ({ user }) => UserMapper.toDomain(user as unknown as UserDTO),
  });

  public async executeImpl(req: Request) {
    const dto = morphism(this.paramsMapper, {
      ...req.body,
      ...req.params,
    });

    const user = await this.useCase.execute(dto, req.user.id);

    return UserMapper.toDTO(user);
  }
}
