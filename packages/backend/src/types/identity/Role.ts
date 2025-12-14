import { IAllRolePermission, IUser } from '..';

export interface IRole {
  id: number;
  code: string;
  name: string;
  permissions?: IAllRolePermission[];
  users?: IUser[];
}
