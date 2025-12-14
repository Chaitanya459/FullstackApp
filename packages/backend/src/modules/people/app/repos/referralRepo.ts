import { ActorId, IReferral } from 'types';
import { Transaction } from '../../../../infra/database/UnitOfWork';

export interface IReferralRepo {
  get(): Promise<IReferral[]>;
  getById(id: string): Promise<IReferral | null>;
  upsert(referral: Partial<IReferral>, actorId: ActorId, transaction?: Transaction): Promise<IReferral>;
  submit(referral: IReferral, actorId: ActorId, transaction?: Transaction): Promise<IReferral>;
}

export const IReferralRepo = Symbol.for(`IReferralRepo`);
