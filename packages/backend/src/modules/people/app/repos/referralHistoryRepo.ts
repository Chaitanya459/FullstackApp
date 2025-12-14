import { ActorId, IReferralStatusHistory } from 'types';
import { Transaction } from '../../../../infra/database/UnitOfWork';

export interface IReferralHistoryRepo {
  create(
    history: Omit<IReferralStatusHistory, `id`>,
    actorId: ActorId,
    transaction?: Transaction
  ): Promise<IReferralStatusHistory>;
  get(referralId: number): Promise<IReferralStatusHistory[]>;
}

export const IReferralHistoryRepo = Symbol.for(`IReferralHistoryRepo`);
