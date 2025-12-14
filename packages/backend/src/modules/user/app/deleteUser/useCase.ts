import { inject, injectable } from 'inversify';
import { IUserRepo } from '../repos';
import { ActorId, IUseCase } from '../../../../types';

@injectable()
export class DeleteUserUseCase implements IUseCase<number, void> {
  public constructor(
    @inject(IUserRepo) private userRepo: IUserRepo,
  ) {}

  public async execute(userId: number, actorId: ActorId): Promise<void> {
    await this.userRepo.delete(userId, actorId);
  }
}
