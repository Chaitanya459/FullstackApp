import { container } from '../../infra/di/inversify.config';
import { IGenderRepo, IGradeLevelRepo, IReferralStatusRepo, IServiceTypeRepo, IStateRepo } from './app/repos';
import { ServiceTypeRepo } from './infra/repos/sequelizeServiceTypeRepo';
import { GetServiceTypeReportController } from './app/getServiceTypeReport/controller';
import { GetServiceTypeReportUseCase } from './app/getServiceTypeReport/useCase';
import { GetServiceTypeGroupsUseCase } from './app/getServiceTypeGroups/useCase';
import { GetServiceTypeGroupsController } from './app/getServiceTypeGroups/controller';
import { IAcademicYearRepo, IServiceTypeGroupRepo } from './app/repos';
import { ServiceTypeGroupRepo } from './infra/repos/SequelizeServiceTypeGroupRepo';
import { AcademicYearRepo } from './infra/repos/SequelizeAcademicYearRepo';
import { GetAcademicYearsController } from './app/getAcademicYears/controller';
import { GetAcademicYearsUseCase } from './app/getAcademicYears/useCase';
import { GetAcademicYearByIdController } from './app/getAcademicYearById/controller';
import { GetAcademicYearByIdUseCase } from './app/getAcademicYearById/useCase';
import { GetGendersUseCase } from './app/getGenders/useCase';
import { GetGendersController } from './app/getGenders/controller';
import { GenderRepo } from './infra/repos/sequelizeGendersRepo';
import { GetGradeLevelsUseCase } from './app/getGradeLevels/useCase';
import { GetGradeLevelsController } from './app/getGradeLevels/controller';
import { GradeLevelRepo } from './infra/repos/sequelizeGradeLevelsRepo';
import { GetServiceTypesController } from './app/getServiceTypes/controller';
import { GetServiceTypesUseCase } from './app/getServiceTypes/useCase';
import { GetStatesController } from './app/getStates/controller';
import { GetStatesUseCase } from './app/getStates/useCase';
import { StateRepo } from './infra/repos/sequelizeStatesRepo';
import { ReferralStatusRepo } from './infra/repos/sequelizeReferralStatusRepo';

// Repos
container.bind(IAcademicYearRepo).to(AcademicYearRepo);
container.bind(IGenderRepo).to(GenderRepo);
container.bind(IGradeLevelRepo).to(GradeLevelRepo);
container.bind(IServiceTypeRepo).to(ServiceTypeRepo);
container.bind(IServiceTypeGroupRepo).to(ServiceTypeGroupRepo);
container.bind(IStateRepo).to(StateRepo);
container.bind(IReferralStatusRepo).to(ReferralStatusRepo);

// Services
//  NONE

//  Use Cases
// Service Type
container.bind(GetServiceTypeReportUseCase).toSelf();
container.bind(GetServiceTypeReportController).toSelf();

container.bind(GetServiceTypesUseCase).toSelf();
container.bind(GetServiceTypesController).toSelf();

// Service Type Group
container.bind(GetServiceTypeGroupsUseCase).toSelf();
container.bind(GetServiceTypeGroupsController).toSelf();

//  Educational Year
container.bind(GetAcademicYearsUseCase).toSelf();
container.bind(GetAcademicYearsController).toSelf();

container.bind(GetAcademicYearByIdUseCase).toSelf();
container.bind(GetAcademicYearByIdController).toSelf();

// Gender
container.bind(GetGendersUseCase).toSelf();
container.bind(GetGendersController).toSelf();

// Grade Level
container.bind(GetGradeLevelsUseCase).toSelf();
container.bind(GetGradeLevelsController).toSelf();

// States
container.bind(GetStatesUseCase).toSelf();
container.bind(GetStatesController).toSelf();
