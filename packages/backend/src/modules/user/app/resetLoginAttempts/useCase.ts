import { inject, injectable } from 'inversify';
import { EventEmitter } from '../../../../infra/events';
import { LoginAttemptsReset } from '../../events/LoginAttemptsReset';
import { IUserRepo } from '../repos';
import { IUseCase } from '../../../../types';

@injectable()
export class ResetLoginAttemptsUseCase implements IUseCase<number, void> {
  public constructor(
    @inject(IUserRepo) private readonly userRepo: IUserRepo,
    @inject(EventEmitter) private readonly eventEmitter: EventEmitter,
  ) {}

  public async execute(userId: number): Promise<void> {
    const user = await this.userRepo.getById(userId);

    if (user.lockedAt) {
      throw new Error(`User is locked`);
    }

    if (!user.loginAttempts) {
      return;
    }

    user.loginAttempts = 0;
    await this.userRepo.update(user, user.id);
    this.eventEmitter.publish(new LoginAttemptsReset({ user }));
  }
}
