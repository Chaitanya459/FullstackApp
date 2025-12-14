import { container } from '../../infra/di/inversify.config';
import { StudentRepo } from './infra/repos/sequelizeStudentRepo';
import { IReferralHistoryRepo, IReferralRepo, IStudentRepo } from './app/repos';
import { GetStudentsUseCase } from './app/getStudents/useCase';
import { GetStudentsController } from './app/getStudents/controller';
import { GetStudentByIdController } from './app/getStudentById/controller';
import { GetStudentByIdUseCase } from './app/getStudentById/useCase';
import { GetStudentSummaryUseCase } from './app/getStudentSummary/useCase';
import { GetStudentSummaryController } from './app/getStudentSummary/controller';
import { GetStudentMonthlySummaryUseCase } from './app/getStudentMonthlySummary/useCase';
import { GetStudentMonthlySummaryController } from './app/getStudentMonthlySummary/controller';
import { ReferralRepo } from './infra/repos/sequelizeReferralRepo';
import { ReferralHistoryRepo } from './infra/repos/sequelizeReferralHistoryRepo';
import { GetReferralByIdUseCase } from './app/getReferralById/useCase';
import { GetReferralByIdController } from './app/getReferralById/controller';
import { GetReferralsUseCase } from './app/getReferrals/useCase';
import { GetReferralsController } from './app/getReferrals/controller';
import { SubmitReferralUseCase } from './app/submitReferrals/useCase';
import { SubmitReferralController } from './app/submitReferrals/controller';
import { UpsertReferralUseCase } from './app/upsertReferral/useCase';
import { UpsertReferralController } from './app/upsertReferral/controller';

// Repos
container.bind(IStudentRepo).to(StudentRepo);
container.bind(IReferralRepo).to(ReferralRepo);
container.bind(IReferralHistoryRepo).to(ReferralHistoryRepo);

// Services
//  NONE

// Use Cases
//  Student
container.bind(GetStudentsUseCase).toSelf();
container.bind(GetStudentsController).toSelf();

container.bind(GetStudentByIdUseCase).toSelf();
container.bind(GetStudentByIdController).toSelf();

container.bind(GetStudentSummaryUseCase).toSelf();
container.bind(GetStudentSummaryController).toSelf();

container.bind(GetStudentMonthlySummaryUseCase).toSelf();
container.bind(GetStudentMonthlySummaryController).toSelf();

// Referral
container.bind(GetReferralByIdUseCase).toSelf();
container.bind(GetReferralByIdController).toSelf();

container.bind(GetReferralsUseCase).toSelf();
container.bind(GetReferralsController).toSelf();

container.bind(SubmitReferralUseCase).toSelf();
container.bind(SubmitReferralController).toSelf();

container.bind(UpsertReferralUseCase).toSelf();
container.bind(UpsertReferralController).toSelf();
