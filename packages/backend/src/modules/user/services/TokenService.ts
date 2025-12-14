import { injectable } from 'inversify';
import config from 'config';
import { sign, verify } from 'jsonwebtoken';
import { StringValue } from 'ms';
import { IUser } from '../../../types';

export interface ITokenService {
  generateToken<T extends object>(payload: T, expiresIn?: StringValue): string;
  generatePasswordResetToken(user: IUser, expiresIn?: StringValue): string;
  verify<T>(token: string): T;
}
export const ITokenService = Symbol.for(`ITokenService`);

@injectable()
export class TokenService implements ITokenService {
  public verify<T>(token: string): T {
    return verify(token, config.get(`token.signKey`)) as T;
  }

  public generateToken<T extends object>(payload: T, expiresIn = config.get<StringValue>(`token.expire`)): string {
    return sign(
      payload,
      config.get(`token.signKey`),
      { expiresIn },
    );
  }

  public generatePasswordResetToken(
    user: IUser,
    expiresIn: StringValue = config.get(`token.passwordResetExpire`),
  ): string {
    return this.generateToken(
      {
        firstName: user.firstName,
        userId: user.id,
      },
      expiresIn,
    );
  }
}
