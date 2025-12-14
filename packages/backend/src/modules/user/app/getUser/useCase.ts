import { NotFound } from 'http-errors';
import { IUseCase, IUser } from 'types';
import { inject, injectable } from 'inversify';
import { IUserRepo } from '../repos';

@injectable()
export class GetUserUseCase implements IUseCase<number, IUser> {
  public constructor(
    @inject(IUserRepo) private readonly userRepo: IUserRepo,
  ) { }

  public async execute(userId: number): Promise<IUser> {
    const user = await this.userRepo.getById(userId, {
      withDeleted: true,
      withPermissions: true,
    });

    if (user) {
      return user;
    }
    throw new NotFound(`Failed to find user`);
  }
}
