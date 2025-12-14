import { Request } from 'express';
import { GetDistrictsDTO } from 'rsd';
import { inject, injectable } from 'inversify';
import morphism, { createSchema } from 'morphism';
import { DistrictMapper } from '../../mappers';
import { BaseController } from '../../../../infra/http/BaseController';
import { districtListQuerySchema } from './validator';
import { GetDistrictsUseCase, IGetDistrictsInput } from './useCase';

@injectable()
export class GetDistrictsController extends BaseController {
  public constructor(
    @inject(GetDistrictsUseCase) private readonly useCase: GetDistrictsUseCase,
  ) {
    super();
  }

  private paramsMapper = createSchema<IGetDistrictsInput, GetDistrictsDTO>({
    id: `id`,
  });

  public async executeImpl(req: Request) {
    const validatedQuery = this.validateRequest(districtListQuerySchema, req.query);

    const dto = morphism(this.paramsMapper, validatedQuery);

    const districts = await this.useCase.execute(dto);

    return districts.map(DistrictMapper.toDTO);
  }
}
