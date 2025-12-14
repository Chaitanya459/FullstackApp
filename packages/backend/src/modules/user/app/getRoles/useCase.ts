import { GetRolesDTO } from 'rsd';
import { IRole, IUseCase } from 'types';
import { inject, injectable } from 'inversify';
import { IRoleRepo } from '../repos';

export interface IGetRolesInput {
  codes?: string[];
  ids?: number[];
  relations?: Array<`permissions` | `users`>;
}

@injectable()
export class GetRolesUseCase implements IUseCase<IGetRolesInput, IRole[]> {
  public constructor(
    @inject(IRoleRepo) private roleRepo: IRoleRepo,
  ) { }

  public async execute(params: GetRolesDTO): Promise<IRole[]> {
    const roles = await this.roleRepo.get(params);
    return roles;
  }
}
