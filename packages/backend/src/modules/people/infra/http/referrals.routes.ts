import express from 'express';
import { container } from '../../../../infra/di/inversify.config';
import { GetReferralsController } from '../../../people/app/getReferrals/controller';
import { UpsertReferralController } from '../../../people/app/upsertReferral/controller';
import { SubmitReferralController } from '../../../people/app/submitReferrals/controller';
import { GetReferralByIdController } from '../../app/getReferralById/controller';

export const referralRouter = express.Router();

const getReferralsController = container.get(GetReferralsController);
referralRouter.get(
  `/`,
  getReferralsController.execute,
);

const getReferralByIdController = container.get(GetReferralByIdController);
referralRouter.get(
  `/:id`,
  getReferralByIdController.execute,
);

const upsertReferralController = container.get(UpsertReferralController);
referralRouter.post(
  `/`,
  upsertReferralController.execute,
);

const submitReferralController = container.get(SubmitReferralController);
referralRouter.put(
  `/:id/submit`,
  submitReferralController.execute,
);
