import { IDocumentation, IUseCase } from 'types';
import { inject, injectable } from 'inversify';
import { IDocumentationRepo } from '../repos';
import { IAcademicYearRepo } from '../../../reference/app/repos';

export interface IGetNotesInput {
  districtId?: number;
  serviceTypeGroupId?: number;
  serviceTypeId?: number;
  studentId?: number;
  therapistId?: number;
  yearId?: number;
}

@injectable()
export class GetNotesUseCase implements IUseCase<IGetNotesInput, IDocumentation[]> {
  public constructor(
    @inject(IDocumentationRepo) private readonly documentationRepo: IDocumentationRepo,
    @inject(IAcademicYearRepo) private readonly academicYearRepo: IAcademicYearRepo,
  ) { }

  public async execute(
    { districtId, serviceTypeGroupId, serviceTypeId, studentId, therapistId, yearId }: IGetNotesInput,
  ): Promise<IDocumentation[]> {
    let startDate: Date | undefined;
    let endDate: Date | undefined;

    if (yearId) {
      const academicYear = await this.academicYearRepo.getById(yearId);
      if (academicYear) {
        ({ endDate, startDate } = academicYear);
      }
    }

    return await this.documentationRepo.get({
      districtId,
      endDate,
      serviceTypeGroupId,
      serviceTypeId,
      startDate,
      studentId,
      therapistId,
    });
  }
}
