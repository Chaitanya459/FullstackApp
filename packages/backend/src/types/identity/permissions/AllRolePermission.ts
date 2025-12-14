export interface IAllRolePermission {
  id: number;
  action: string;
  inverted: boolean;
  roleId: number;
  subject: string;
}
