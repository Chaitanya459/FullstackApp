import { IAudited, IRole, IServiceType, IServiceTypeGroup } from '..';

export interface IUser extends IAudited {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  lockedAt?: Date | null;
  loginAttempts?: number | null;
  readonly name: string;
  password: string;
  roles?: IRole[];
  serviceTypeGroups?: IServiceTypeGroup[];
  serviceTypes?: IServiceType[];
}
