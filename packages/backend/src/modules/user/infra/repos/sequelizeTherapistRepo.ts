import { col, fn, Op, WhereOptions } from 'sequelize';
import { ITherapistSummary } from 'types';
import { injectable } from 'inversify';
import { IGetTherapistsOptions, ITherapistRepo } from '../../app/repos';
import { UserModel } from '../../../../infra/database/sequelize/models';

@injectable()
export class TherapistRepo implements ITherapistRepo {
  public async getSummary(opts: IGetTherapistsOptions = {}): Promise<ITherapistSummary[]> {
    const { districtId, endAt, serviceTypeGroupId, startAt } = opts;

    const where: WhereOptions<UserModel> = {
      ...(endAt && { createdAt: { [Op.lte]: endAt } }),
      ...(startAt && { [Op.or]: [{ deletedAt: null }, { deletedAt: { [Op.gte]: startAt } }] }),
    };

    const therapists = await UserModel.findAll({
      attributes: {
        include: [
          [ fn(`BOOL_OR`, col(`therapistServiceDistricts.is_external`)), `isExternalProvider` ],
          [ fn(`ARRAY_AGG`, fn(`DISTINCT`, col(`therapistServiceDistricts->serviceType.code`))), `serviceTypes` ],
          [ fn(`COUNT`, fn(`DISTINCT`, col(`therapistServiceDistricts.student_id`))), `totalStudents` ],
        ],
      },
      group: [ `UserModel.id` ],
      include: [
        {
          association: `therapistServiceDistricts`,
          attributes: [],
          include: [
            {
              association: `serviceType`,
              attributes: [],
            },
          ],
          required: true,
          where,
        },
      ],
      subQuery: false,
    });

    if (!districtId) {
      return therapists.map((therapist) => {
        const plain = therapist.get({ plain: true });
        return {
          ...plain,
          studentsAtDistrict: 0,
          therapistId: therapist.id,
        };
      }) as unknown as ITherapistSummary[];
    }

    const districtServices = await UserModel.findAll({
      attributes: {
        include: [
          [ fn(`COUNT`, fn(`DISTINCT`, col(`therapistServiceDistricts.student_id`))), `studentsAtDistrict` ],
        ],
      },
      group: [ `UserModel.id` ],
      include: [
        {
          association: `therapistServiceDistricts`,
          attributes: [],
          include: [
            {
              association: `serviceType`,
              attributes: [],
              required: !!serviceTypeGroupId,
              where: {
                ...(!!serviceTypeGroupId && { serviceTypeGroupId }),
              },
            },
          ],
          required: true,
          where: {
            ...where,
            districtId,
          },
        },
      ],
      subQuery: false,
    });

    const districtCountMap = new Map(
      districtServices.map((service) => {
        const plain = service.get({ plain: true }) as unknown as { id: number, studentsAtDistrict: number };
        return [ plain.id, Number(plain.studentsAtDistrict) || 0 ];
      }),
    );

    return therapists
      .filter((therapist) => districtCountMap.has(therapist.id))
      .map((therapist) => {
        const plain = therapist.get({ plain: true });
        return {
          ...plain,
          studentsAtDistrict: districtCountMap.get(therapist.id) ?? 0,
          therapistId: therapist.id,
        };
      }) as unknown as ITherapistSummary[];
  }
}
