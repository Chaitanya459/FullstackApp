import { IReferral, IUseCase } from 'types';
import { inject, injectable } from 'inversify';
import { NotFound } from 'http-errors';
import { IReferralRepo } from '../repos';

export interface IGetReferralByIdInput {
  id: string;
}

@injectable()
export class GetReferralByIdUseCase implements IUseCase<IGetReferralByIdInput, IReferral | null> {
  public constructor(
    @inject(IReferralRepo) private readonly referralRepo: IReferralRepo,
  ) {}

  public async execute(input: IGetReferralByIdInput): Promise<IReferral | null> {
    const existingReferral = await this.referralRepo.getById(input.id);
    if (!existingReferral) {
      throw new NotFound(`Referral not found`);
    }
    return existingReferral;
  }
}
