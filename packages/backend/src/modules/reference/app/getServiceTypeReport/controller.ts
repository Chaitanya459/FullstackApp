import { inject, injectable } from 'inversify';
import morphism, { createSchema } from 'morphism';
import { IServiceTypeReport } from 'types';
import { GetServiceTypeReportDTO } from 'rsd';
import { BaseController } from '../../../../infra/http/BaseController';
import { GetServiceTypeReportUseCase } from './useCase';

@injectable()
export class GetServiceTypeReportController extends BaseController {
  public constructor(
    @inject(GetServiceTypeReportUseCase) private useCase: GetServiceTypeReportUseCase,
  ) {
    super();
  }

  private responseMapper = createSchema<IServiceTypeReport, GetServiceTypeReportDTO>({
    serviceTypeCode: `serviceTypeCode`,
    serviceTypeGroupCode: `serviceTypeGroupCode`,
    students: ({ students }) => students ? Number(students) : 0,
  });

  public async executeImpl() {
    const reports = await this.useCase.execute();
    return reports?.map((report) => morphism(this.responseMapper, report));
  }
}
