import { ActorId, IReferral, IUseCase } from 'types';
import { inject, injectable } from 'inversify';
import { NotFound } from 'http-errors';
import { IReferralHistoryRepo, IReferralRepo } from '../repos';
import { IReferralStatusRepo } from '../../../reference/app/repos';
import { UnitOfWork } from '../../../../infra/database/UnitOfWork';
import sequelize from '../../../../infra/database/sequelize';

export interface ISubmitReferralInput {
  id: string;
}

@injectable()
export class SubmitReferralUseCase implements IUseCase<ISubmitReferralInput, IReferral> {
  public constructor(
    @inject(IReferralRepo) private readonly referralRepo: IReferralRepo,
    @inject(IReferralHistoryRepo) private readonly referralHistoryRepo: IReferralHistoryRepo,
    @inject(IReferralStatusRepo) private readonly referralStatusRepo: IReferralStatusRepo,
  ) {}

  public async execute({ id }: ISubmitReferralInput, actorId: ActorId): Promise<IReferral> {
    const existingReferral = await this.referralRepo.getById(id);
    if (!existingReferral) {
      throw new NotFound(`Referral not found`);
    }

    const unitOfWork = new UnitOfWork(sequelize);

    try {
      const transaction = await unitOfWork.begin();

      const status = await this.referralStatusRepo.get({ code: `NEW` });
      const processedStatusId = status?.id;
      const statusAt = new Date();

      const updatedReferral = await this.referralRepo.submit(
        {
          ...existingReferral,
          comment: null,
          completedAt: new Date(),
          statusAt,
          statusBy: actorId,
          statusId: processedStatusId,
        } as IReferral,
        actorId,
        transaction,
      );

      await this.referralHistoryRepo.create({
        createdAt: statusAt,
        createdBy: actorId,
        referralId: Number(id),
        statusId: processedStatusId,
      },
      actorId,
      transaction);

      await unitOfWork.commit();

      return updatedReferral;
    } catch (error) {
      await unitOfWork.rollback();

      throw error;
    }
  }
}
