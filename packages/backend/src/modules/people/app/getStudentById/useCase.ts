import { IStudent, IUseCase } from 'types';
import { inject, injectable } from 'inversify';
import { IStudentRepo } from '../repos';

export interface IGetStudentByIdInput {
  endDate?: string;
  serviceTypeGroupId?: number;
  startDate?: string;
  studentId: number;
  therapistId?: number;
}

@injectable()
export class GetStudentByIdUseCase implements IUseCase<IGetStudentByIdInput, IStudent> {
  public constructor(
    @inject(IStudentRepo) private readonly studentRepo: IStudentRepo,
  ) { }

  public async execute(input: IGetStudentByIdInput): Promise<IStudent> {
    return this.studentRepo.getById(input.studentId, input);
  }
}
