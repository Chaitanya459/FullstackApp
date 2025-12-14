import { IGradeLevel } from 'types';
import { injectable } from 'inversify';
import { IGradeLevelRepo } from '../../app/repos';
import { GradeLevelModel } from '../../../../infra/database/sequelize/models';

@injectable()
export class GradeLevelRepo implements IGradeLevelRepo {
  public async get(): Promise<IGradeLevel[]> {
    const gradeLevels = await GradeLevelModel.findAll({ order: [[ `order`, `ASC` ]] });
    return gradeLevels?.map((gradeLevel) => gradeLevel.get({ plain: true }));
  }
}
