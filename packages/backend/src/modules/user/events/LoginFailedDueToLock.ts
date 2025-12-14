import { IUser } from 'types';
import { DomainEvent } from '../../../infra/events';

export class LoginFailedDueToLock extends DomainEvent<{
  user: IUser;
}> {}
