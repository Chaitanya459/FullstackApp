export interface PermissionDTO {
  id: number;
  action: string;
  inverted: boolean;
  roleId: number;
  subject: string;
}
