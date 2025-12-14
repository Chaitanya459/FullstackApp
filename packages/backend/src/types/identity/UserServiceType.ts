import { IAudited } from 'types/shared';

export interface IUserServiceType extends IAudited {
  id: number;
  serviceTypeId: number;
  userId: number;
}
