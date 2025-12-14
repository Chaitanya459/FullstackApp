import { IReferral, IUseCase } from 'types';
import { inject, injectable } from 'inversify';
import { IReferralRepo } from '../repos';

@injectable()
export class GetReferralsUseCase implements IUseCase<void, IReferral[]> {
  public constructor(
    @inject(IReferralRepo) private readonly referralRepo: IReferralRepo,
  ) {}

  public async execute(): Promise<IReferral[]> {
    const referrals = await this.referralRepo.get();

    return referrals;
  }
}
