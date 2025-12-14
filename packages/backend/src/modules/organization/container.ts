import { container } from '../../infra/di/inversify.config';

import { IDistrictRepo } from './app/repos';
import { DistrictRepo } from './infra/repos/sequelizeDistrictRepo';

import { GetDistrictsUseCase } from './app/getDistricts/useCase';
import { GetDistrictsController } from './app/getDistricts/controller';

import { GetDistrictSummaryUseCase } from './app/getDistrictSummary/useCase';
import { GetDistrictSummaryController } from './app/getDistrictSummary/controller';

import { ExportDistrictsUseCase } from './app/exportDistricts/useCase';
import { ExportDistrictsController } from './app/exportDistricts/controller';

// Repos
container.bind(IDistrictRepo).to(DistrictRepo);

// Services
//  NONE

// Use Cases
//  District
container.bind(GetDistrictsUseCase).toSelf();
container.bind(GetDistrictsController).toSelf();

container.bind(GetDistrictSummaryUseCase).toSelf();
container.bind(GetDistrictSummaryController).toSelf();

container.bind(ExportDistrictsUseCase).toSelf();
container.bind(ExportDistrictsController).toSelf();
