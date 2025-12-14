import { ActorId, IReferral, IUseCase } from 'types';
import { inject, injectable } from 'inversify';
import { IReferralHistoryRepo, IReferralRepo } from '../repos';
import { UnitOfWork } from '../../../../infra/database/UnitOfWork';
import sequelize from '../../../../infra/database/sequelize';

export interface IUpsertReferralInput {
  id?: number;
  referral: IReferral;
}

@injectable()
export class UpsertReferralUseCase implements IUseCase<IUpsertReferralInput, IReferral> {
  public constructor(
    @inject(IReferralRepo) private referralRepo: IReferralRepo,
    @inject(IReferralHistoryRepo) private referralHistoryRepo: IReferralHistoryRepo,
  ) {}

  public async execute({ id, referral }: IUpsertReferralInput, actorId: ActorId): Promise<IReferral> {
    const unitOfWork = new UnitOfWork(sequelize);

    try {
      const transaction = await unitOfWork.begin();

      let { createdAt, createdBy } = referral;
      let existingReferral: IReferral | null = null;

      if (id) {
        existingReferral = await this.referralRepo.getById(String(id));
        createdAt = createdAt ?? existingReferral?.createdAt ?? new Date();
        createdBy = createdBy ?? existingReferral?.createdBy ?? actorId;
      } else {
        createdAt = createdAt ?? new Date();
        createdBy = createdBy ?? actorId;
      }

      const statusId = referral?.statusId ?? 1;
      const statusAt = new Date();

      const updatedReferral = {
        ...referral,
        id,
        createdAt,
        createdBy,
        statusAt,
        statusBy: actorId,
        statusId,
        updatedAt: new Date(),
        updatedBy: actorId,
      };

      const created = await this.referralRepo.upsert(updatedReferral as IReferral, actorId, transaction);

      const hasStatusChanged = !existingReferral || existingReferral.statusId !== statusId;

      if (hasStatusChanged) {
        await this.referralHistoryRepo.create({
          createdAt: statusAt,
          createdBy: actorId,
          referralId: created.id,
          statusId,
        },
        actorId,
        transaction);
      }

      await unitOfWork.commit();

      return created;
    } catch (error) {
      await unitOfWork.rollback();

      throw error;
    }
  }
}
