import { UserDTO } from '..';

export interface CreateUserDTO {
  user: Omit<UserDTO, `id`>;
}
