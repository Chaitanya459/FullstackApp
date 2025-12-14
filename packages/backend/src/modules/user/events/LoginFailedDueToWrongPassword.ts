import { IUser } from 'types';
import { DomainEvent } from '../../../infra/events';

export class LoginFailedDueToWrongPassword extends DomainEvent<{
  user: IUser;
}> {}
