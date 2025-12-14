import { inject, injectable } from 'inversify';
import { GradeLevelMapper } from '../../mappers';
import { BaseController } from '../../../../infra/http/BaseController';
import { GetGradeLevelsUseCase } from './useCase';

@injectable()
export class GetGradeLevelsController extends BaseController {
  public constructor(
    @inject(GetGradeLevelsUseCase) private useCase: GetGradeLevelsUseCase,
  ) {
    super();
  }

  public async executeImpl() {
    const gradeLevels = await this.useCase.execute();

    return gradeLevels?.map(GradeLevelMapper.toDTO);
  }
}
