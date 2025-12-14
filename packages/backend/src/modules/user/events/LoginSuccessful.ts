import { IUser } from 'types';
import { DomainEvent } from '../../../infra/events';

export class LoginSuccessful extends DomainEvent<{
  user: IUser;
}> {}
