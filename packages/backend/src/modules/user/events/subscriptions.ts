import { container } from '../../../infra/di/inversify.config';
import { ResetLoginAttemptsUseCase } from '../app/resetLoginAttempts/useCase';
import { systemEventEmitter } from '../../../infra/events';
import { FailLoginUseCase } from '../app/failLogin/useCase';
import { RequestPasswordResetUseCase } from '../app/requestPasswordReset/useCase';
import packageJson from '../../../../package.json';
import { logger } from '../../../utils';
import { UserUnlocked } from './UserUnlocked';
import { LoginSuccessful } from './LoginSuccessful';
import { LoginFailedDueToWrongPassword } from './LoginFailedDueToWrongPassword';
import { UserCreated } from './UserCreated';
import { LoginFailedDueToNoUser } from './LoginFailedDueToNoUser';
import { LoginFailedDueToLock } from './LoginFailedDueToLock';

const resetLoginAttemptsUseCase = container.get(ResetLoginAttemptsUseCase);
const failLoginUseCase = container.get(FailLoginUseCase);
const requestPasswordResetUseCase = container.get(RequestPasswordResetUseCase);

const loginMetaData = (status: string) => ({
  "id": ``,
  "agency": `N/A`,
  "datetime": new Date().toString(),
  "env": process.env.NODE_ENV,
  "method": `LOGIN FAILED`,
  "org": `rsd`,
  'package-name': packageJson.name,
  'package-version': packageJson.version,
  'status-code': status,
  "url": `/api/login`,
  "user": `N/A`,
});

const handleResetLoginAttempts = async (event: LoginSuccessful | UserUnlocked) => {
  await resetLoginAttemptsUseCase.execute(event.eventData.user.id);
};

const handleWrongPassword = async (event: LoginFailedDueToWrongPassword) => {
  await failLoginUseCase.execute(event.eventData.user.id);
};

const handleUserCreated = async (event: UserCreated) => {
  await requestPasswordResetUseCase.execute({
    email: event.eventData.user.email,
    type: `newAccount`,
  });
};

systemEventEmitter.subscribe(LoginSuccessful, handleResetLoginAttempts);
systemEventEmitter.subscribe(UserUnlocked, handleResetLoginAttempts);
systemEventEmitter.subscribe(LoginFailedDueToWrongPassword, handleWrongPassword);
systemEventEmitter.subscribe(UserCreated, handleUserCreated);
systemEventEmitter.subscribe(LoginFailedDueToNoUser, (event: LoginFailedDueToNoUser) =>
  logger.info(`Failed to find user "${event.eventData.email}"`, loginMetaData(`401 - User Doesn't Exist`)));
systemEventEmitter.subscribe(LoginFailedDueToLock, (event: LoginFailedDueToLock) =>
  logger.info(`user account "${event.eventData.user.email}" is locked`, loginMetaData(`402 - User Locked`)));
systemEventEmitter.subscribe(LoginFailedDueToWrongPassword, (event: LoginFailedDueToWrongPassword) =>
  logger.info(`user "${event.eventData.user.email}" entered a wrong password`, loginMetaData(`403 - Wrong Password`)));
