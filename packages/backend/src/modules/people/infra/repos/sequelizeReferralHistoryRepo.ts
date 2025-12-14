import { injectable } from 'inversify';
import { ActorId, IReferralStatusHistory } from 'types';
import { Transaction } from '../../../../infra/database/UnitOfWork';
import { ReferralStatusHistoryModel } from '../../../../infra/database/sequelize/models';
import { IReferralHistoryRepo } from '../../app/repos';

@injectable()
export class ReferralHistoryRepo implements IReferralHistoryRepo {
  public async create(history: Omit<IReferralStatusHistory, `id`>, actorId: ActorId, transaction?: Transaction) {
    const result = await ReferralStatusHistoryModel.create(history, { actorId, transaction });
    return result.get({ plain: true });
  }

  public async get(referralId: number): Promise<IReferralStatusHistory[]> {
    const result = await ReferralStatusHistoryModel.findAll({
      where: { referralId },
    });
    return result?.map((referralStatusHistory) => referralStatusHistory.get({ plain: true }));
  }
}
