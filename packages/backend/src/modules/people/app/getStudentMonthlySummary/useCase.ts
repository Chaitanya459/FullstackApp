import { inject, injectable } from 'inversify';
import { IStudentMonthlySummary, IUseCase } from 'types';
import { IAcademicYearRepo } from '../../../reference/app/repos';
import { IStudentRepo } from '../repos';

export interface IGetMonthlySummaryInput {
  therapistId: number;
  yearId?: string;
}

@injectable()
export class GetStudentMonthlySummaryUseCase implements IUseCase<IGetMonthlySummaryInput, IStudentMonthlySummary[]> {
  public constructor(
    @inject(IStudentRepo) private readonly studentRepo: IStudentRepo,
    @inject(IAcademicYearRepo) private readonly academicYearRepo: IAcademicYearRepo,
  ) {}

  public async execute(input: IGetMonthlySummaryInput): Promise<IStudentMonthlySummary[]> {
    const { therapistId, yearId } = input;

    const academicYear = await this.academicYearRepo.getById(Number(yearId));

    return this.studentRepo.getMonthlySummary({
      endDate: academicYear.endDate,
      startDate: academicYear.startDate,
      therapistId,
      year: yearId,
    });
  }
}
