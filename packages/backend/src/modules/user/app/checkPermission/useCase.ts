import { PureAbility } from '@casl/ability';
import { inject, injectable } from 'inversify';
import { IRoleRepo } from '../repos';
import { IUseCase } from '../../../../types';

export interface IPermissionCheckInput {
  action: string;
  ids: number[];
  subject: string;
}

@injectable()
export class PermissionCheckUseCase implements IUseCase<IPermissionCheckInput, boolean> {
  public constructor(
    @inject(IRoleRepo) private readonly roleRepo: IRoleRepo,
  ) { }

  public async execute({
    action,
    ids,
    subject,
  }: IPermissionCheckInput): Promise<boolean> {
    const roles = await this.roleRepo.get({
      ids,
      relations: [ `permissions` ],
    });

    const permissions = roles.flatMap((role) => role.permissions);
    const ability = new PureAbility(permissions);

    return ability.can(action, subject);
  }
}
