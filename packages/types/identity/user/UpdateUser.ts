import { UserDTO } from '..';

export interface UpdateUserDTO {
  user: Partial<Omit<UserDTO, `id`>> & {
    roleIds?: number[];
    serviceTypeGroupIds?: number[];
    serviceTypeIds?: number[];
  };
}
