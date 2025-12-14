import dayjs from 'dayjs';
import { injectable } from 'inversify';
import { col, fn, Op } from 'sequelize';
import { IDocumentationMonthlySummary, IStudent, IStudentMonthlySummary, IStudentSummary } from 'types';
import { StudentModel } from '../../../../infra/database/sequelize/models';
import { IGetStudentByIdFilter, IGetStudentFilter, IGetStudentMinutesFilter, IStudentRepo } from '../../app/repos';

@injectable()
export class StudentRepo implements IStudentRepo {
  public async get(filter: IGetStudentFilter): Promise<IStudent[]> {
    const {
      districtId,
      endAt,
      requireDocumentation = false,
      requireServiceAssignment = true,
      serviceTypeGroupId,
      startAt,
      therapistId,
    } = filter;

    const students = await StudentModel.findAll({
      include: [
        {
          association: `enrollments`,
          include: [
            `districtOfResidence`,
            `gradeLevel`,
          ],
          required: true,
          where: {
            ...!!districtId && { billingDistrictId: districtId },
            ...!!endAt && { enrollmentDate: { [Op.lte]: endAt } },
            ...!!startAt && {
              [Op.or]: [
                { exitDate: null },
                { exitDate: { [Op.gte]: startAt } },
              ],
            },
          },
        },
        {
          association: `serviceAssignments`,
          include: [
            `therapist`,
            {
              association: `serviceType`,
              include: [
                `serviceTypeGroup`,
              ],
              required: requireServiceAssignment,
              where: {
                ...!!serviceTypeGroupId && { serviceTypeGroupId },
              },
            },
          ],
          required: requireServiceAssignment,
          where: {
            ...!!endAt && { entryDate: { [Op.lte]: endAt } },
            ...!!therapistId && { therapistId },
            ...!!startAt && {
              [Op.or]: [
                { exitDate: null },
                { exitDate: { [Op.gte]: startAt } },
              ],
            },
          },
        },
        {
          association: `documentation`,
          required: requireDocumentation,
          where: {
            ...!!therapistId && { therapistId },
            ...startAt && endAt && {
              serviceDate: {
                [Op.gte]: startAt,
                [Op.lte]: endAt,
              },
            },
          },
        },
      ],
      order: [[ `lastName`, `ASC` ], [ `firstName`, `ASC` ]],
    });

    return students.map((student) => student.get({ plain: true }));
  }

  public async getById(studentId: number, filter: IGetStudentByIdFilter): Promise<IStudent> {
    const { endDate, serviceTypeGroupId, startDate, therapistId } = filter;

    const student = await StudentModel.findOne({
      include: [
        {
          association: `enrollments`,
          include: [
            `billingDistrict`,
            `building`,
            `districtOfResidence`,
            `districtOfAttendance`,
            `gradeLevel`,
          ],
          required: false,
          where: {
            ...!!endDate && { enrollmentDate: { [Op.lte]: endDate } },
            ...!!startDate && {
              [Op.or]: [
                { exitDate: null },
                { exitDate: { [Op.gte]: startDate } },
              ],
            },
          },
        },
        {
          association: `serviceAssignments`,
          include: [
            {
              association: `serviceType`,
              include: [
                { association: `serviceTypeGroup` },
              ],
              required: false,
              where: {
                ...serviceTypeGroupId ? { serviceTypeGroupId } : {},
              },
            },
          ],
          required: false,
          where: { ...!!therapistId && { therapistId } },
        },
        {
          association: `documentation`,
          include: [
            {
              association: `serviceType`,
              include: [
                { association: `serviceTypeGroup` },
              ],
              required: true,
              where: {
                ...serviceTypeGroupId ? { serviceTypeGroupId } : {},
              },
            },
            `therapist`,
          ],
          required: false,
          where: {
            ...therapistId ? { therapistId } : {},
            ...startDate && endDate ?
                {
                  serviceDate: {
                    [Op.gte]: startDate,
                    [Op.lte]: endDate,
                  },
                } :
                {},
          },
        },
      ],
      order: [[ `lastName`, `ASC` ], [ `firstName`, `ASC` ]],
      where: { id: studentId },
    });

    if (!student) {
      throw new Error(`Student with id ${studentId} not found`);
    }

    return student.get({ plain: true });
  }

  public async getSummary(filter: IGetStudentMinutesFilter): Promise<IStudentSummary[]> {
    const { endDate, startDate, therapistId } = filter;

    const students = await StudentModel.findAll({
      attributes: {
        include: [
          [ fn(`COALESCE`, fn(`SUM`, col(`documentation.direct_minutes`)), 0), `directMinutes` ],
          [ fn(`COALESCE`, fn(`SUM`, col(`documentation.indirect_minutes`)), 0), `indirectMinutes` ],
          [ fn(`COALESCE`, fn(`SUM`, col(`documentation.travel_minutes`)), 0), `travelMinutes` ],
          [ fn(`MAX`, col(`documentation.service_date`)), `lastDirectService` ],
        ],
      },
      group: [
        `StudentModel.id`,
        `enrollments.id`,
        `enrollments->billingDistrict.id`,
        `enrollments->building.id`,
        `serviceAssignments.id`,
        `serviceAssignments->therapist.id`,
        `serviceAssignments->serviceType.id`,
      ],
      include: [
        {
          association: `enrollments`,
          include: [
            {
              association: `billingDistrict`,
            },
            {
              association: `building`,
            },
          ],
          required: true,
        },
        {
          association: `documentation`,
          attributes: [],
          required: false,
          where: {
            therapistId,
            ...(startDate && endDate && {
              serviceDate: {
                [Op.gte]: startDate,
                [Op.lte]: endDate,
              },
            }),
          },
        },
        {
          association: `serviceAssignments`,
          include: [
            {
              association: `therapist`,
            },
            {
              association: `serviceType`,
            },
          ],
          required: true,
          where: {
            therapistId,
          },
        },
      ],
      order: [[ `lastName`, `ASC` ], [ `firstName`, `ASC` ]],
    });

    return students.map((student) => student.get({ plain: true })) as IStudentSummary[];
  }

  public async getMonthlySummary(filter: IGetStudentMinutesFilter): Promise<IStudentMonthlySummary[]> {
    const { endDate, startDate, therapistId } = filter;

    const startMonth = startDate ? dayjs(startDate).month() + 1 : 0;
    const startYear = startDate ? dayjs(startDate).year() : 0;
    const endMonth = endDate ? dayjs(endDate).month() + 1 : 0;
    const endYear = endDate ? dayjs(endDate).year() : 0;

    const students = await StudentModel.findAll({
      include: [
        {
          association: `enrollments`,
          include: [
            {
              association: `billingDistrict`,
            },
          ],
          required: true,
        },
        {
          association: `serviceAssignments`,
          include: [
            {
              association: `therapist`,
            },
            {
              association: `serviceType`,
            },
          ],
          required: true,
          where: {
            therapistId,
          },
        },
        {
          association: `documentationMonthlySummary`,
          required: false,
          where: {
            therapistId,
            ...(startDate && endDate && {
              [Op.or]: [
                {
                  month: { [Op.gte]: startMonth },
                  year: startYear,
                },
                {
                  month: { [Op.lte]: endMonth },
                  year: endYear,
                },
              ],
            }),
          },
        },
      ],
    });

    return students.map((student) => {
      const plain = student.get({ plain: true }) as IStudent;
      const monthlyData: { [key: number]: number } = {};

      if (plain.documentationMonthlySummary && Array.isArray(plain.documentationMonthlySummary)) {
        plain.documentationMonthlySummary.forEach((record: IDocumentationMonthlySummary) => {
          const month = Number(record.month);
          const minutes = Number(record.totalDirectMinutes) || 0;
          monthlyData[month] = (Number(monthlyData[month]) || 0) + minutes;
        });
      }

      const monthlySummary = Array.from({ length: 12 }, (_, i) => ({
        month: i,
        totalDirectMinutes: monthlyData[i + 1] || 0,
      }));

      const { documentationMonthlySummary: _d, ...rest } = plain;

      return {
        ...rest,
        monthlySummary,
      };
    }) as IStudentMonthlySummary[];
  }
}
