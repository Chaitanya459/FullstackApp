import { inject, injectable } from 'inversify';
import { IServiceTypeGroup, IUseCase } from 'types';
import { IServiceTypeGroupRepo } from '../repos';

@injectable()
export class GetServiceTypeGroupsUseCase implements IUseCase<void, IServiceTypeGroup[]> {
  public constructor(
    @inject(IServiceTypeGroupRepo) private readonly serviceTypeGroupRepo: IServiceTypeGroupRepo,
  ) {}

  public async execute(): Promise<IServiceTypeGroup[]> {
    return this.serviceTypeGroupRepo.get();
  }
}
