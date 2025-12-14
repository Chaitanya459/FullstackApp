import { Op } from 'sequelize';
import { GetRolesDTO } from 'rsd';
import { IRole } from 'types';
import { injectable } from 'inversify';
import { IRoleRepo } from '../../app/repos';
import { RoleModel } from '../../../../infra/database/sequelize/models';

@injectable()
export class RoleRepo implements IRoleRepo {
  public async get({ codes, ids, relations }: GetRolesDTO): Promise<IRole[]> {
    const roles = await RoleModel.findAll({
      include: [
        `permissions`,
        ...relations?.includes(`users`) ? [ `users` ] : [],
      ],
      where: {
        ...!!ids?.length && { id: { [Op.in]: ids } },
        ...!!codes?.length && { code: { [Op.in]: codes } },
      },
    });

    return roles.map((role) => ({
      ...role.get(),
      permissions: role.permissions?.map((permission) => permission.get()),
    }));
  }
}
