import { IUser } from 'types';
import { DomainEvent } from '../../../infra/events';

export class UserCreated extends DomainEvent<{
  createdBy: number;
  user: IUser;
}> {}
