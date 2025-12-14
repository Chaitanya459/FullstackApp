import { injectable } from 'inversify';
import { IServiceTypeGroup } from 'types';
import { ServiceTypeGroupModel } from '../../../../infra/database/sequelize/models';
import { IServiceTypeGroupRepo } from '../../app/repos/serviceTypeGroupRepo';

@injectable()
export class ServiceTypeGroupRepo implements IServiceTypeGroupRepo {
  public async get(): Promise<IServiceTypeGroup[]> {
    const serviceTypeGroups = await ServiceTypeGroupModel.findAll();

    return serviceTypeGroups.map((group) => group.get({ plain: true }));
  }
}
