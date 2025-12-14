import { TokenExpiredError } from 'jsonwebtoken';
import { IUseCase, IUser } from 'types';
import { PasswordResetTokenDTO } from 'rsd';
import { inject, injectable } from 'inversify';
import { PasswordReset } from '../../events/PasswordReset';
import { ITokenService } from '../../services/TokenService';
import { IBlacklistedTokenRepo, IUserRepo } from '../repos';
import { IPasswordManagerService } from '../../services/PasswordManagerService';
import { EventEmitter } from '../../../../infra/events';

export interface IResetPasswordInput {
  password: string;
  prt: string;
}

export interface IResetPasswordOutput {
  user: IUser;
}

@injectable()
export class ResetPasswordUseCase implements IUseCase<IResetPasswordInput, IResetPasswordOutput> {
  public constructor(
    @inject(IUserRepo) private readonly userRepo: IUserRepo,
    @inject(EventEmitter) private readonly eventEmitter: EventEmitter,
    @inject(ITokenService) private readonly tokenService: ITokenService,
    @inject(IPasswordManagerService) private readonly passwordManagerService: IPasswordManagerService,
    @inject(IBlacklistedTokenRepo) private readonly blacklistedTokenRepo: IBlacklistedTokenRepo,
  ) {}

  public async execute({ password, prt }: IResetPasswordInput): Promise<IResetPasswordOutput> {
    const decodedPRT = this.getDecodedToken(prt);
    const user = await this.userRepo.getById(decodedPRT.userId);
    const usedTokens = await this.blacklistedTokenRepo.getTokens(user.id);
    if (usedTokens && usedTokens.includes(prt)) {
      throw new Error(`Your password reset link has been already used. Please request a new one.`);
    }
    this.passwordManagerService.checkPassword(password);
    const hashedPassword = await this.passwordManagerService.hashPassword(password);

    const updatedUser = await this.userRepo.update({ id: user.id, password: hashedPassword }, user.id);

    this.eventEmitter.publish(new PasswordReset({ user: updatedUser }));
    await this.blacklistedTokenRepo.addToList(user.id, prt);

    return { user: updatedUser };
  }

  public getDecodedToken(prt: string): PasswordResetTokenDTO {
    try {
      const decodedPRT = this.tokenService.verify(prt);
      return decodedPRT as PasswordResetTokenDTO;
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        throw new Error(`Your password reset link has expired. Please request a new one.`);
      }
      throw error;
    }
  }
}
