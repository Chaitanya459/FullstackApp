import { Request } from 'express';
import { inject, injectable } from 'inversify';
import { BaseController } from '../../../../infra/http/BaseController';
import { SubmitReferralUseCase } from './useCase';

@injectable()
export class SubmitReferralController extends BaseController {
  public constructor(
    @inject(SubmitReferralUseCase) private readonly useCase: SubmitReferralUseCase,
  ) {
    super();
  }

  public async executeImpl(req: Request) {
    const { id } = req.params;
    const referral = await this.useCase.execute({ id }, req.user.id);
    return referral;
  }
}
