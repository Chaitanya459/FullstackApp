import { inject, injectable } from 'inversify';
import { IUserRepo } from '../repos';
import { IUseCase } from '../../../../types';

@injectable()
export class RestoreUserUseCase implements IUseCase<number, void> {
  public constructor(
    @inject(IUserRepo) private userRepo: IUserRepo,
  ) {}

  public async execute(user: number, actorId: number): Promise<void> {
    await this.userRepo.restore(user, actorId);
  }
}
