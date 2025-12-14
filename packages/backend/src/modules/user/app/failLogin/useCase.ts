import { inject, injectable } from 'inversify';
import config from 'config';
import { UserLocked } from '../../events/UserLocked';
import { IUserRepo } from '../repos';
import { EventEmitter } from '../../../../infra/events';
import { IUseCase } from '../../../../types';

@injectable()
export class FailLoginUseCase implements IUseCase<number, void> {
  public constructor(
    @inject(IUserRepo) private readonly userRepo: IUserRepo,
    @inject(EventEmitter) private readonly eventEmitter: EventEmitter,
  ) {}

  public async execute(userId: number): Promise<void> {
    const user = await this.userRepo.getById(userId);

    if (user.lockedAt) {
      throw new Error(`How was a locked user able to login?`);
    }

    user.loginAttempts = (user.loginAttempts || 0) + 1;

    const loginAttempts = config.get<number>(`auth.loginAttempts`);

    if (!loginAttempts) {
      throw new Error(`FailedLoginAttempts config is not set`);
    }

    if (user.loginAttempts >= loginAttempts) {
      await this.userRepo.update({ id: user.id, lockedAt: new Date() }, user.id);

      this.eventEmitter.publish(new UserLocked({ user }));

      return;
    }

    await this.userRepo.update(user, user.id);
  }
}
