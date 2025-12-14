import { inject, injectable } from 'inversify';
import { BaseController } from '../../../../infra/http/BaseController';
import { AcademicYearMapper } from '../../mappers';
import { GetAcademicYearsUseCase } from './useCase';

@injectable()
export class GetAcademicYearsController extends BaseController {
  public constructor(
    @inject(GetAcademicYearsUseCase)
    private readonly useCase: GetAcademicYearsUseCase,
  ) {
    super();
  }

  protected async executeImpl() {
    const academicYears = await this.useCase.execute();

    return academicYears?.map(AcademicYearMapper.toDTO);
  }
}
