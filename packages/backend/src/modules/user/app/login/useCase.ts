import { Forbidden, MethodNotAllowed } from 'http-errors';
import { ActorId, ILoginToken, IUseCase, IUser } from 'types';
import { inject, injectable } from 'inversify';
import { LoginFailedDueToLock, LoginFailedDueToWrongPassword, LoginSuccessful } from '../../events';
import { LoginFailedDueToNoUser } from '../../events/LoginFailedDueToNoUser';
import { IPasswordManagerService } from '../../services/PasswordManagerService';
import { ITokenService } from '../../services/TokenService';
import { IUserRepo } from '../repos';
import { EventEmitter } from '../../../../infra/events';

export interface ILoginInput {
  email: string;
  password: string;
}

export interface ILoginOutput {
  token: string;
  user: IUser;
}

@injectable()
export class LoginUseCase implements IUseCase<ILoginInput, ILoginOutput> {
  public constructor(
    @inject(IUserRepo) private readonly userRepo: IUserRepo,
    @inject(EventEmitter) private readonly eventEmitter: EventEmitter,
    @inject(IPasswordManagerService) private readonly passwordManagerService: IPasswordManagerService,
    @inject(ITokenService) private readonly tokenService: ITokenService,
  ) {}

  public async execute(dto: ILoginInput): Promise<ILoginOutput> {
    const { email, password } = dto;

    const user = await this.userRepo.getByEmailWithPassword(email);

    if (!user) {
      this.eventEmitter.publish(new LoginFailedDueToNoUser({ email }));
      throw new Forbidden(`Failed to find user`);
    }

    if (user.lockedAt) {
      this.eventEmitter.publish(new LoginFailedDueToLock({ user }));
      throw new MethodNotAllowed(`User is locked`);
    }

    const legit = await this.passwordManagerService.verifyPassword(password, user.password);

    if (!legit) {
      this.eventEmitter.publish(new LoginFailedDueToWrongPassword({ user }));
      throw new Forbidden(`Failed to find user`);
    }

    const token = this.tokenService.generateToken<ILoginToken>({
      id: user.id as ActorId,
      email: user.email,
      roleCodes: user.roles?.map((r) => r.code) || [],
      roleIds: user.roles?.map((r) => Number(r.id)) || [],
    });

    this.eventEmitter.publish(new LoginSuccessful({ user }));

    return {
      token,
      user,
    };
  }
}
