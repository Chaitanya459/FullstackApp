import { PermissionDTO, RoleDTO, ServiceTypeDTO, ServiceTypeGroupDTO } from '../..';

export interface UserDTO {
  id: number;
  createdAt: string;
  createdBy: number;
  creator?: UserDTO;
  deletedAt?: string;
  deletedBy?: number;
  deletor?: UserDTO;
  email: string;
  firstName: string;
  lastName: string;
  lockedAt?: Date | null;
  loginAttempts?: number | null;
  name: string;
  permissions?: PermissionDTO[];
  readonly roles?: RoleDTO[];
  readonly serviceTypeGroups?: ServiceTypeGroupDTO[];
  readonly serviceTypes?: ServiceTypeDTO[];
  updatedAt: string;
  updatedBy: number;
  updater?: UserDTO;
}
