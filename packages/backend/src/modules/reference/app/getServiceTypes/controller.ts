import { inject, injectable } from 'inversify';
import { BaseController } from '../../../../infra/http/BaseController';
import { ServiceTypeMapper } from '../../mappers';
import { GetServiceTypesUseCase } from './useCase';

@injectable()
export class GetServiceTypesController extends BaseController {
  public constructor(
    @inject(GetServiceTypesUseCase)
    private readonly useCase: GetServiceTypesUseCase,
  ) {
    super();
  }

  protected async executeImpl() {
    const serviceTypes = await this.useCase.execute();

    return serviceTypes?.map(ServiceTypeMapper.toDTO);
  }
}
