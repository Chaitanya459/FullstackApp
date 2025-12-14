import { Request } from 'express';
import { ReferralDTO } from 'rsd';
import { inject, injectable } from 'inversify';
import morphism, { createSchema } from 'morphism';
import { BaseController } from '../../../../infra/http/BaseController';
import { ReferralMapper } from '../../mappers';
import { IUpsertReferralInput, UpsertReferralUseCase } from './useCase';

@injectable()
export class UpsertReferralController extends BaseController {
  public constructor(
    @inject(UpsertReferralUseCase) private readonly useCase: UpsertReferralUseCase,
  ) {
    super();
  }

  private paramsMapper = createSchema<IUpsertReferralInput, ReferralDTO>({
    id: `id`,
    referral: (dto) => ReferralMapper.toDomain(dto),
  });

  public async executeImpl(req: Request) {
    const dto = morphism(this.paramsMapper, req.body);

    const referral = await this.useCase.execute(dto, req.user.id);

    return ReferralMapper.toDTO(referral);
  }
}
