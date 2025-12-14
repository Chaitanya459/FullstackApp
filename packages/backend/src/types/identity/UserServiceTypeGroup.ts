import { IAudited } from 'types/shared';

export interface IUserServiceTypeGroup extends IAudited {
  id: number;
  serviceTypeGroupId: number;
  userId: number;
}
