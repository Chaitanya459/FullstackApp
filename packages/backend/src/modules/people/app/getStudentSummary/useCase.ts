import { inject, injectable } from 'inversify';
import { IStudentSummary, IUseCase } from 'types';
import { IAcademicYearRepo } from '../../../reference/app/repos';
import { IStudentRepo } from '../repos';

export interface IGetStudentSummaryInput {
  therapistId: number;
  yearId?: string;
}

@injectable()
export class GetStudentSummaryUseCase implements IUseCase<IGetStudentSummaryInput, IStudentSummary[]> {
  public constructor(
    @inject(IStudentRepo) private readonly studentRepo: IStudentRepo,
    @inject(IAcademicYearRepo) private readonly academicYearRepo: IAcademicYearRepo,
  ) {}

  public async execute(input: IGetStudentSummaryInput): Promise<IStudentSummary[]> {
    const { therapistId, yearId } = input;

    const academicYear = await this.academicYearRepo.getById(Number(yearId));

    return this.studentRepo.getSummary({
      endDate: academicYear.endDate,
      startDate: academicYear.startDate,
      therapistId,
      year: yearId,
    });
  }
}
