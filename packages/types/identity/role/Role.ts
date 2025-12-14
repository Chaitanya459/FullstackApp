import { PermissionDTO } from '..';

export interface RoleDTO {
  id: number;
  code: string;
  name: string;
  permissions?: PermissionDTO[];
}
