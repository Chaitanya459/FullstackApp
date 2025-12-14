import { inject, injectable } from 'inversify';
import { IUseCase } from 'types';
import { chain, flatMap, groupBy, isNumber, uniq, uniqBy } from 'lodash';
import { IDistrictRepo } from '../repos';

export interface IDistrictSummaryInput {
  endDate: string;
  ids?: number[];
  serviceTypeGroupId?: number;
  startDate: string;
}

export interface IDistrictSummaryOutput {
  id: number;
  activeStudents: number;
  assignedTherapistCount: number;
  caseLoad?: number;
  fteProjected?: number;
  fteRequested?: number;
  fteUsed?: number;
  name: string;
  serviceTypeGroupIds: number[];
  totalStudentServed?: number;
  ytdCost?: number;
}

@injectable()
export class GetDistrictSummaryUseCase implements IUseCase<IDistrictSummaryInput, IDistrictSummaryOutput[]> {
  public constructor(
    @inject(IDistrictRepo) private districtRepo: IDistrictRepo,
  ) {}

  public async execute(params: IDistrictSummaryInput): Promise<IDistrictSummaryOutput[]> {
    const districts = await this.districtRepo.get(params);

    const districtSummaries: IDistrictSummaryOutput[] = districts.map((district) => {
      const therapistServiceTypes = (district.therapistDistricts)
        .map((td) => td.serviceType)
        .filter((st): st is NonNullable<typeof st> => !!st);

      const studentServiceTypes = flatMap(district.billingEnrollments, (be) =>
        (be.student.serviceAssignments)
          .map((sa) => sa.serviceType)
          .filter((st): st is NonNullable<typeof st> => !!st));

      const allServiceTypesUsed = uniqBy([ ...therapistServiceTypes, ...studentServiceTypes ], `id`);

      const serviceTypesByGroup = groupBy(allServiceTypesUsed, `serviceTypeGroupId`);

      const serviceTypeGroupIds = uniq(allServiceTypesUsed.map((st) => st.serviceTypeGroupId));

      const activeStudentIds = chain(district.billingEnrollments)
        .filter((be) =>
          Array.isArray(be.student.serviceAssignments) &&
          be.student.serviceAssignments.length > 0)
        .map((be) => be.student?.id)
        .filter(isNumber)
        .uniq()
        .value();

      const assignedTherapistCount = uniqBy(district.therapistDistricts, `therapistId`).length;

      return {
        id: district.id,
        activeStudents: activeStudentIds.length,
        assignedTherapistCount,
        name: district.name,
        serviceTypeGroupIds,
        serviceTypesByGroup,
      };
    });

    return districtSummaries;
  }
}
