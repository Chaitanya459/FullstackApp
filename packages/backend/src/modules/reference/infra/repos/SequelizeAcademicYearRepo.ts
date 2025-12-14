import { injectable } from 'inversify';
import { IAcademicYear } from 'types';
import { AcademicYearModel } from '../../../../infra/database/sequelize/models';
import { IAcademicYearRepo } from '../../app/repos';

@injectable()
export class AcademicYearRepo implements IAcademicYearRepo {
  public async get(): Promise<IAcademicYear[]> {
    const years = await AcademicYearModel.findAll({
      order: [[ `startDate`, `DESC` ]],
    });

    return years.map((y) => y.get({ plain: true }));
  }

  public async getById(id: number): Promise<IAcademicYear | null> {
    const year = await AcademicYearModel.findByPk(id);

    return year ? year.get({ plain: true }) : null;
  }

  public async create(data: Omit<IAcademicYear, `id`>): Promise<IAcademicYear> {
    const year = await AcademicYearModel.create(data);
    return year.get({ plain: true });
  }
}
