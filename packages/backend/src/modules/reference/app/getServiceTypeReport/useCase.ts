import { inject, injectable } from 'inversify';
import { IServiceTypeReport } from 'types';
import { IServiceTypeRepo } from '../repos';

@injectable()
export class GetServiceTypeReportUseCase {
  public constructor(
    @inject(IServiceTypeRepo) private readonly serviceTypeRepo: IServiceTypeRepo,
  ) {}

  public async execute(): Promise<IServiceTypeReport[]> {
    return await this.serviceTypeRepo.getReport();
  }
}
