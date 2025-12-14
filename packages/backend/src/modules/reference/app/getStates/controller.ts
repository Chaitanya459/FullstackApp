import { inject, injectable } from 'inversify';
import { BaseController } from '../../../../infra/http/BaseController';
import { StateMapper } from '../../mappers';
import { GetStatesUseCase } from './useCase';

@injectable()
export class GetStatesController extends BaseController {
  public constructor(
    @inject(GetStatesUseCase) private useCase: GetStatesUseCase,
  ) {
    super();
  }

  public async executeImpl() {
    const states = await this.useCase.execute();

    return states?.map(StateMapper.toDTO);
  }
}
