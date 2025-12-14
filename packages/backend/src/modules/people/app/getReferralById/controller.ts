import { Request } from 'express';
import { inject, injectable } from 'inversify';
import { BaseController } from '../../../../infra/http/BaseController';
import { GetReferralByIdUseCase } from './useCase';

@injectable()
export class GetReferralByIdController extends BaseController {
  public constructor(
    @inject(GetReferralByIdUseCase) private useCase: GetReferralByIdUseCase,
  ) {
    super();
  }

  public async executeImpl(req: Request) {
    const { id } = req.params;

    const referral = await this.useCase.execute({ id });

    return referral;
  }
}
