import { inject, injectable } from 'inversify';
import { BaseController } from '../../../../infra/http/BaseController';
import { GenderMapper } from '../../mappers';
import { GetGendersUseCase } from './useCase';

@injectable()
export class GetGendersController extends BaseController {
  public constructor(
    @inject(GetGendersUseCase) private useCase: GetGendersUseCase,
  ) {
    super();
  }

  public async executeImpl() {
    const genders = await this.useCase.execute();

    return genders?.map(GenderMapper.toDTO);
  }
}
