export interface GetUserDTO {
  email?: string;
  name?: string;
  role?: string;
  withDeleted?: boolean;
  withPermissions?: boolean;
}
