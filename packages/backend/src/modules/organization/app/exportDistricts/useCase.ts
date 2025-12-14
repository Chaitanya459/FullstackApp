import { inject, injectable } from 'inversify';
import { IUseCase } from 'types';
import { chain, isNumber, uniqBy } from 'lodash';
import { stringify } from 'csv-stringify';
import { IDistrictRepo } from '../repos';

export interface IExportDistrictsInput {
  endDate?: string;
  ids: number[];
  serviceTypeGroupId?: number;
  startDate?: string;
}

@injectable()
export class ExportDistrictsUseCase implements IUseCase<IExportDistrictsInput, string> {
  public constructor(
    @inject(IDistrictRepo) private readonly districtRepo: IDistrictRepo,
  ) {}

  public async execute(params: IExportDistrictsInput): Promise<string> {
    const selectedDistricts = await this.districtRepo.get(params);

    const districtSummaries = selectedDistricts.map((district) => {
      const activeStudentIds = chain(district.billingEnrollments || [])
        .filter((be) =>
          Array.isArray(be.student?.serviceAssignments) &&
          be.student.serviceAssignments.length > 0)
        .map((be) => be.student?.id)
        .filter(isNumber)
        .uniq()
        .value();

      const assignedTherapistCount = uniqBy(district.therapistDistricts || [], `therapistId`).length;

      return {
        activeStudents: activeStudentIds.length,
        assignedTherapists: assignedTherapistCount,
        caseLoad: `-`,
        district: district.name || ``,
        fteProjected: `-`,
        fteRequested: `-`,
        fteUsed: `-`,
        totalStudentsServed: `-`,
        ytdCost: `-`,
      };
    });

    return new Promise<string>((resolve, reject) => {
      const stringifyOptions = {
        columns: {
          activeStudents: `Active Students`,
          assignedTherapists: `Assigned Therapists`,
          caseLoad: `Case Load`,
          district: `District`,
          fteProjected: `FTE Projected`,
          fteRequested: `FTE Requested`,
          fteUsed: `FTE Used`,
          totalStudentsServed: `Total Students Served`,
          ytdCost: `YTD Cost`,
        },
        header: true,
      };
      stringify(
        districtSummaries,
        stringifyOptions,
        (err, output) => {
          if (err) {
            reject(err);
          } else {
            resolve(output);
          }
        },
      );
    });
  }
}
