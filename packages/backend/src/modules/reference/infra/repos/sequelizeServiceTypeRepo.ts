import { injectable } from 'inversify';
import { IServiceType, IServiceTypeReport } from 'types';
import { Op } from 'sequelize';
import sequelize from '../../../../infra/database/sequelize';
import { IServiceTypeRepo } from '../../app/repos';
import { ServiceTypeModel } from '../../../../infra/database/sequelize/models';

@injectable()
export class ServiceTypeRepo implements IServiceTypeRepo {
  public async get(): Promise<IServiceType[]> {
    const serviceTypes = await ServiceTypeModel.findAll({
      include: [{
        association: `serviceTypeGroup`,
        required: false,
      }],
      order: [[ `code`, `ASC` ]],
    });

    return serviceTypes?.map((s) => s.get({ plain: true }));
  }

  public async getReport(): Promise<IServiceTypeReport[]> {
    const results = await ServiceTypeModel.findAll({
      attributes: [
        [ `code`, `serviceTypeCode` ],
        [ sequelize.col(`serviceTypeGroup.code`), `serviceTypeGroupCode` ],
        [ sequelize.fn(`COUNT`, sequelize.fn(`DISTINCT`,
          sequelize.col(`studentServiceAssignments.student_id`))), `students` ],
      ],
      group: [ `ServiceTypeModel.code`, `serviceTypeGroup.code` ],
      include: [
        {
          association: `studentServiceAssignments`,
          attributes: [],
          required: false,
          where: {
            [Op.or]: [
              { exitDate: { [Op.gte]: new Date() } },
              { exitDate: null },
            ],
          },
        },
        {
          association: `serviceTypeGroup`,
          attributes: [],
          required: false,
        },
      ],
      raw: true,
    });
    return results as unknown as IServiceTypeReport[];
  }
}
