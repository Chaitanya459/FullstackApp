import { IGender } from 'types';
import { injectable } from 'inversify';
import { IGenderRepo } from '../../app/repos';
import { GenderModel } from '../../../../infra/database/sequelize/models';

@injectable()
export class GenderRepo implements IGenderRepo {
  public async get(): Promise<IGender[]> {
    const genders = await GenderModel.findAll();
    return genders?.map((gender) => gender.get({ plain: true }));
  }
}
