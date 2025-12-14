import { DomainEvent } from '../../../infra/events';

export class LoginFailedDueToNoUser extends DomainEvent<{
  email: string;
}> {}
