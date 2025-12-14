import { inject, injectable } from 'inversify';
import { EventEmitter } from '../../../../infra/events';
import { IUseCase } from '../../../../types';
import { UserUnlocked } from '../../events';
import { IUserRepo } from '../repos';

@injectable()
export class UnlockUserUseCase implements IUseCase<number, void> {
  public constructor(
    @inject(IUserRepo) private readonly userRepository: IUserRepo,
    @inject(EventEmitter) private readonly eventEmitter: EventEmitter,
  ) {}

  public async execute(userId: number, actorId: number): Promise<void> {
    const user = await this.userRepository.getById(userId);

    if (user.lockedAt) {
      await this.userRepository.update({ lockedAt: null }, actorId);
    }

    this.eventEmitter.publish(new UserUnlocked({ user }));
  }
}
