import { Request } from 'express';
import { GetRolesDTO } from 'rsd';
import { inject, injectable } from 'inversify';
import morphism, { createSchema } from 'morphism';
import { BaseController } from '../../../../infra/http/BaseController';
import { RoleMapper } from '../../mappers';
import { handleArrayParam } from '../../../../utils';
import { GetRolesUseCase, IGetRolesInput } from './useCase';

@injectable()
export class GetRolesController extends BaseController {
  public constructor(
    @inject(GetRolesUseCase) private useCase: GetRolesUseCase,
  ) {
    super();
  }

  private paramsMapper = createSchema<IGetRolesInput, GetRolesDTO>({
    codes: ({ codes }) => handleArrayParam(codes),
    ids: ({ ids }) => handleArrayParam(ids),
    relations: ({ relations }) => handleArrayParam(relations),
  });

  public async executeImpl(req: Request) {
    const dto = morphism(this.paramsMapper, req.query);
    const roles = await this.useCase.execute(dto);

    return roles?.map(RoleMapper.toDTO);
  }
}
