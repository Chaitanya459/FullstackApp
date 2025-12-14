import { inject, injectable } from 'inversify';
import { IServiceType, IUseCase } from 'types';
import { IServiceTypeRepo } from '../repos';

@injectable()
export class GetServiceTypesUseCase implements IUseCase<void, IServiceType[]> {
  public constructor(
    @inject(IServiceTypeRepo) private readonly serviceTypeRepo: IServiceTypeRepo,
  ) {}

  public execute(): Promise<IServiceType[]> {
    return this.serviceTypeRepo.get();
  }
}
