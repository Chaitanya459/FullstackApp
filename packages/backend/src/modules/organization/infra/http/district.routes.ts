import express from 'express';
import { container } from '../../../../infra/di/inversify.config';
import { GetDistrictsController } from '../../app/getDistricts/controller';
import { GetDistrictSummaryController } from '../../app/getDistrictSummary/controller';
import { ExportDistrictsController } from '../../app/exportDistricts/controller';

export const districtRouter = express.Router();

const getDistrictsController = container.get(GetDistrictsController);
districtRouter.get(`/`, getDistrictsController.execute);

const getDistrictSummaryController = container.get(GetDistrictSummaryController);
districtRouter.get(`/summary`, getDistrictSummaryController.execute);

const exportDistrictsController = container.get(ExportDistrictsController);
districtRouter.post(`/export`, exportDistrictsController.execute);
