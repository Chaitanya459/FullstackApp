import express from 'express';
import { container } from '../../../../infra/di/inversify.config';
import { GetTherapistSummaryController } from '../../app/getTherapistSummary/controller';

export const therapistRouter = express.Router();

const getTherapistSummaryController = container.get(GetTherapistSummaryController);
therapistRouter.get(`/`, getTherapistSummaryController.execute);
