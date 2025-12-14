import {
  LoginDTO,
  LoginResponseDTO,
  PasswordResetRequestDTO,
  PasswordResetTokenDTO,
  ResetPasswordDTO,
  UserDTO,
} from 'rsd';
import client from '@/lib/http.config';

const BASE_URL = `/auth`;

export class AuthService {
  public static async login(data: LoginDTO): Promise<UserDTO> {
    return client.post<LoginResponseDTO>(`${BASE_URL}/login`, data)
      .then((response) => response.data.user);
  }

  public static async logout(): Promise<void> {
    return client.post(`${BASE_URL}/logout`);
  }

  public static requestPasswordReset(dto: PasswordResetRequestDTO) {
    return client.post(`${BASE_URL}/reset/password`, dto);
  }

  public static checkResetToken(prt: string): Promise<PasswordResetTokenDTO> {
    return client.get<PasswordResetTokenDTO>(`${BASE_URL}/reset/password`, {
      params: {
        prt,
      },
    })
      .then((response) => response.data);
  }

  public static resetPassword(dto: ResetPasswordDTO) {
    return client.put(`${BASE_URL}/reset/password`, dto);
  }
}
