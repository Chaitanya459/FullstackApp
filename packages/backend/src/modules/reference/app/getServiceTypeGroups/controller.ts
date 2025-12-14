import { inject, injectable } from 'inversify';
import { BaseController } from '../../../../infra/http/BaseController';
import { ServiceTypeGroupMapper } from '../../mappers';
import { GetServiceTypeGroupsUseCase } from './useCase';

@injectable()
export class GetServiceTypeGroupsController extends BaseController {
  public constructor(
    @inject(GetServiceTypeGroupsUseCase)
    private readonly useCase: GetServiceTypeGroupsUseCase,
  ) {
    super();
  }

  protected async executeImpl() {
    const serviceTypeGroups = await this.useCase.execute();

    return serviceTypeGroups?.map(ServiceTypeGroupMapper.toDTO);
  }
}
