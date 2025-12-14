import { ActorId, IReferral } from 'types';
import { injectable } from 'inversify';
import { IReferralRepo } from '../../app/repos';
import { ReferralModel } from '../../../../infra/database/sequelize/models';
import { Transaction } from '../../../../infra/database/UnitOfWork';

@injectable()
export class ReferralRepo implements IReferralRepo {
  public async get(): Promise<IReferral[]> {
    const referrals = await ReferralModel.findAll({
      include: [
        { association: `status` },
        { association: `statusCreator` },
      ],
    });
    return referrals?.map((referral) => referral.get({ plain: true }));
  }

  public async upsert(referral: IReferral, actorId: ActorId, transaction?: Transaction): Promise<IReferral> {
    const [ record ] = await ReferralModel.upsert(referral, {
      actorId,
      returning: true,
      transaction,
      validate: false,
    });

    return record.get({ plain: true });
  }

  public async submit(referral: IReferral, actorId: ActorId, transaction?: Transaction): Promise<IReferral> {
    const existingReferral = await ReferralModel.findByPk(referral.id);

    if (!existingReferral) {
      throw new Error(`Referral not found`);
    }

    await existingReferral.update(
      { completedAt: referral.completedAt },
      {
        actorId,
        transaction,
        validate: true,
      },
    );

    return existingReferral.get({ plain: true });
  }

  public async getById(id: string): Promise<IReferral | null> {
    const referral = await ReferralModel.findByPk(id, {
      include: [
        { association: `status` },
        { association: `statusCreator` },
      ],
    });
    return referral ? referral.get({ plain: true }) : null;
  }
}
