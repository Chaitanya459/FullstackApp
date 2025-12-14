import { inject, injectable } from 'inversify';
import { IAcademicYear, IUseCase } from 'types';
import { IAcademicYearRepo } from '../repos';

@injectable()
export class GetAcademicYearsUseCase implements IUseCase<void, IAcademicYear[]> {
  public constructor(
    @inject(IAcademicYearRepo) private readonly academicYearRepo: IAcademicYearRepo,
  ) {}

  public async execute(): Promise<IAcademicYear[]> {
    const today = new Date();
    let years = await this.academicYearRepo.get();

    const found = years.some(
      (y) => today >= new Date(y.startDate) && today <= new Date(y.endDate),
    );

    if (!found) {
      const year = today.getMonth() >= 6 ? today.getFullYear() : today.getFullYear() - 1;
      const startDate = new Date(year, 6, 1);
      const endDate = new Date(year + 1, 5, 30);
      const name = `${year}-${year + 1}`;

      await this.academicYearRepo.create({
        endDate,
        name,
        startDate,
      });

      years = await this.academicYearRepo.get();
    }

    return years;
  }
}
