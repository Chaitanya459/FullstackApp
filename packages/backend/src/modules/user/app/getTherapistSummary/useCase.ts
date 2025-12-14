import { inject, injectable } from 'inversify';
import { ITherapistSummary } from 'types';
import { IAcademicYearRepo } from '../../../reference/app/repos';
import { IGetTherapistsOptions, ITherapistRepo } from '../repos';

export interface IGetTherapistInput {
  academicYearId?: number;
  districtId?: number;
  serviceTypeGroupId?: number;
}

@injectable()
export class GetTherapistSummaryUseCase {
  public constructor(
    @inject(ITherapistRepo) private readonly therapistRepo: ITherapistRepo,
    @inject(IAcademicYearRepo) private readonly academicYearRepo: IAcademicYearRepo,
  ) {}

  public async execute(input: IGetTherapistInput): Promise<ITherapistSummary[]> {
    const { academicYearId, districtId, serviceTypeGroupId } = input;

    const academicYear = await this.academicYearRepo.getById(academicYearId);

    const filter: IGetTherapistsOptions = {
      districtId,
      endAt: academicYear.endDate,
      serviceTypeGroupId,
      startAt: academicYear.startDate,
    };

    return this.therapistRepo.getSummary(filter);
  }
}
