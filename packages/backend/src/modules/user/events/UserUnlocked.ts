import { IUser } from 'types';
import { DomainEvent } from '../../../infra/events';

export class UserUnlocked extends DomainEvent<{
  user: IUser;
}> {}
