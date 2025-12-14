import { injectable } from 'inversify';
import { IDistrict } from 'types';
import { Op } from 'sequelize';
import { IDistrictRepo, IGetDistrictFilter } from '../../app/repos';
import { DistrictModel } from '../../../../infra/database/sequelize/models';

@injectable()
export class DistrictRepo implements IDistrictRepo {
  public async get(filter: IGetDistrictFilter = {}): Promise<IDistrict[]> {
    const { endDate, ids, serviceTypeGroupId, startDate } = filter;

    const rows = await DistrictModel.findAll({
      include: [
        {
          association: `therapistDistricts`,
          include: [
            {
              association: `serviceType`,
              where: {
                ...serviceTypeGroupId && { serviceTypeGroupId },
              },
            },
          ],
          required: false,
          where: {
            ...endDate && { assignedDate: { [Op.lte]: endDate } },
          },
        },
        {
          association: `billingEnrollments`,
          include: [
            {
              association: `student`,
              include: [
                {
                  association: `serviceAssignments`,
                  include: [
                    {
                      association: `serviceType`,
                      where: { ...serviceTypeGroupId && { serviceTypeGroupId } },
                    },
                  ],
                  required: false,
                },
              ],
            },
          ],
          required: false,
          where: {
            ...endDate && { enrollmentDate: { [Op.lte]: endDate } },
            ...startDate && {
              [Op.or]: [
                { exitDate: null },
                { exitDate: { [Op.gte]: startDate } },
              ],
            },
          },
        },
      ],
      order: [[ `name`, `ASC` ]],
      where: {
        ...!!ids?.length && { id: { [Op.in]: ids } },
      },
    });

    return rows.map((row) => row.get({ plain: true }));
  }
}
