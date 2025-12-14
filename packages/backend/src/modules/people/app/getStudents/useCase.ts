import { inject, injectable } from 'inversify';
import { IStudent, IUseCase } from 'types';
import { IAcademicYearRepo } from '../../../reference/app/repos';
import { IGetStudentFilter, IStudentRepo } from '../repos/studentRepo';

export interface IGetStudentsInput {
  academicYearId?: number;
  districtId?: number;
  requireDocumentation?: boolean;
  requireServiceAssignment?: boolean;
  serviceTypeGroupId?: number;
  therapistId: number;
}

@injectable()
export class GetStudentsUseCase implements IUseCase<IGetStudentsInput, IStudent[]> {
  public constructor(
    @inject(IStudentRepo) private readonly studentRepo: IStudentRepo,
    @inject(IAcademicYearRepo) private readonly academicYearRepo: IAcademicYearRepo,
  ) {}

  public async execute(input: IGetStudentsInput): Promise<IStudent[]> {
    const {
      academicYearId,
      districtId,
      requireDocumentation,
      requireServiceAssignment,
      serviceTypeGroupId,
      therapistId,
    } = input;

    const academicYear = await this.academicYearRepo.getById(academicYearId);

    const filter: IGetStudentFilter = {
      districtId,
      endAt: academicYear?.endDate,
      requireDocumentation,
      requireServiceAssignment,
      serviceTypeGroupId,
      startAt: academicYear?.startDate,
      therapistId,
    };

    return this.studentRepo.get(filter);
  }
}
