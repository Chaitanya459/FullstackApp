import { inject, injectable } from 'inversify';
import { IAcademicYear, IUseCase } from 'types';
import { IAcademicYearRepo } from '../repos';

export interface IGetAcademicYearByIdInput {
  id: number;
}

@injectable()
export class GetAcademicYearByIdUseCase implements IUseCase<IGetAcademicYearByIdInput, IAcademicYear> {
  public constructor(
    @inject(IAcademicYearRepo) private readonly academicYearRepo: IAcademicYearRepo,
  ) {}

  public async execute({ id }: IGetAcademicYearByIdInput): Promise<IAcademicYear> {
    return this.academicYearRepo.getById(id);
  }
}
