import { inject, injectable } from 'inversify';
import { BaseController } from '../../../../infra/http/BaseController';
import { ReferralMapper } from '../../mappers';
import { GetReferralsUseCase } from './useCase';

@injectable()
export class GetReferralsController extends BaseController {
  public constructor(
    @inject(GetReferralsUseCase) private useCase: GetReferralsUseCase,
  ) {
    super();
  }

  public async executeImpl() {
    const referrals = await this.useCase.execute();

    return referrals?.map(ReferralMapper.toDTO);
  }
}
