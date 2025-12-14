import { container } from '../../infra/di/inversify.config';
import { IBlacklistedTokenRepo, IRoleRepo, IUserRepo } from './app/repos';
import { BlacklistedTokenRepo } from './infra/repos/redisBlacklistedTokenRepo';
import { RoleRepo } from './infra/repos/sequelizeRoleRepo';
import { UserRepo } from './infra/repos/sequelizeUserRepo';
import { ITokenService, TokenService } from './services/TokenService';
import { IPasswordManagerService, PasswordManagerService } from './services/PasswordManagerService';
import { CreateUserController } from './app/createUser/controller';
import { CreateUserUseCase } from './app/createUser/useCase';
import { PermissionCheckUseCase } from './app/checkPermission/useCase';
import { DeleteUserUseCase } from './app/deleteUser/useCase';
import { DeleteUserController } from './app/deleteUser/controller';
import { FailLoginUseCase } from './app/failLogin/useCase';
import { GetRolesUseCase } from './app/getRoles/useCase';
import { GetRolesController } from './app/getRoles/controller';
import { GetUserUseCase } from './app/getUser/useCase';
import { GetUserController } from './app/getUser/controller';
import { LoginUseCase } from './app/login/useCase';
import { LoginController } from './app/login/controller';
import { LogoutController } from './app/logout/LogoutController';
import { RequestPasswordResetUseCase } from './app/requestPasswordReset/useCase';
import { RequestPasswordResetController } from './app/requestPasswordReset/controller';
import { ResetLoginAttemptsUseCase } from './app/resetLoginAttempts/useCase';
import { ResetPasswordUseCase } from './app/resetPassword/useCase';
import { ResetPasswordController } from './app/resetPassword/controller';
import { CheckPasswordResetController } from './app/resetPassword/checkController';
import { RestoreUserUseCase } from './app/restoreUser/useCase';
import { RestoreUserController } from './app/restoreUser/controller';
import { SearchUsersUseCase } from './app/searchUsers/useCase';
import { SearchUsersController } from './app/searchUsers/controller';
import { UnlockUserUseCase } from './app/unlockUser/useCase';
import { UnlockUserController } from './app/unlockUser/controller';
import { UpdateUserUseCase } from './app/updateUser/useCase';
import { UpdateUserController } from './app/updateUser/controller';
import { GetMeController } from './app/getUser/getMeController';
import { GetTherapistSummaryController } from './app/getTherapistSummary/controller';
import { GetTherapistSummaryUseCase } from './app/getTherapistSummary/useCase';
import { ITherapistRepo } from './app/repos/therapistRepo';
import { TherapistRepo } from './infra/repos/sequelizeTherapistRepo';

// Repos
container.bind(IBlacklistedTokenRepo).to(BlacklistedTokenRepo);
container.bind(IRoleRepo).to(RoleRepo);
container.bind(IUserRepo).to(UserRepo);
container.bind(ITherapistRepo).to(TherapistRepo);

// Services
container.bind(ITokenService).to(TokenService);
container.bind(IPasswordManagerService).to(PasswordManagerService);

// Use Cases
//  User
container.bind(CreateUserUseCase).toSelf();
container.bind(CreateUserController).toSelf();

container.bind(DeleteUserUseCase).toSelf();
container.bind(DeleteUserController).toSelf();

container.bind(FailLoginUseCase).toSelf();

container.bind(GetUserUseCase).toSelf();
container.bind(GetUserController).toSelf();
container.bind(GetMeController).toSelf();

container.bind(RestoreUserUseCase).toSelf();
container.bind(RestoreUserController).toSelf();

container.bind(SearchUsersUseCase).toSelf();
container.bind(SearchUsersController).toSelf();

container.bind(UpdateUserUseCase).toSelf();
container.bind(UpdateUserController).toSelf();

// Therapist
container.bind(GetTherapistSummaryUseCase).toSelf();
container.bind(GetTherapistSummaryController).toSelf();

// Auth
container.bind(LoginUseCase).toSelf();
container.bind(LoginController).toSelf();

container.bind(LogoutController).toSelf();

container.bind(RequestPasswordResetUseCase).toSelf();
container.bind(RequestPasswordResetController).toSelf();

container.bind(ResetLoginAttemptsUseCase).toSelf();

container.bind(ResetPasswordUseCase).toSelf();
container.bind(ResetPasswordController).toSelf();
container.bind(CheckPasswordResetController).toSelf();

container.bind(UnlockUserUseCase).toSelf();
container.bind(UnlockUserController).toSelf();

// Permissions
container.bind(PermissionCheckUseCase).toSelf();

// Roles
container.bind(GetRolesUseCase).toSelf();
container.bind(GetRolesController).toSelf();
