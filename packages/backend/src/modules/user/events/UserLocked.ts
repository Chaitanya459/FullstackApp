import { IUser } from 'types';
import { DomainEvent } from '../../../infra/events';

export class UserLocked extends DomainEvent<{
  user: IUser;
}> {}
