import { UserDTO } from '..';

export interface LoginResponseDTO {
  token: string;
  user: UserDTO;
}
