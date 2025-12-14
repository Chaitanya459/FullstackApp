import { injectable } from 'inversify';
import { IReferralStatus } from 'types';
import { ReferralStatusModel } from '../../../../infra/database/sequelize/models';
import { IGetReferralStatusOptions, IReferralStatusRepo } from '../../app/repos';

@injectable()
export class ReferralStatusRepo implements IReferralStatusRepo {
  public async get({ code }: IGetReferralStatusOptions = {}): Promise<IReferralStatus> {
    const result = await ReferralStatusModel.findOne({
      where: {
        ...code && { code },
      },
    });

    return result.get({ plain: true });
  }
}
