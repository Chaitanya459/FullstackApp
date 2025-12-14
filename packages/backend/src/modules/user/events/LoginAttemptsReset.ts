import { IUser } from 'types';
import { DomainEvent } from '../../../infra/events';

export class LoginAttemptsReset extends DomainEvent<{
  user: IUser;
}> {}
