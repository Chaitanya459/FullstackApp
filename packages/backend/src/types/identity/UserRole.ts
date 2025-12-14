import { IAudited } from 'types/shared';

export interface IUserRole extends IAudited {
  id: number;
  roleId: number;
  userId: number;
}
