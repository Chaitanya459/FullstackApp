import { IUser } from 'types';
import { DomainEvent } from '../../../infra/events';

export class PasswordReset extends DomainEvent<{
  user: IUser;
}> {}
