import { IUseCase, IUser } from 'types';
import { inject, injectable } from 'inversify';
import { IUserRepo } from '../repos';

export interface ISearchUsersInput {
  email?: string;
  name?: string;
  role?: string;

  withDeleted?: boolean;
  withPermissions?: boolean;
}

@injectable()
export class SearchUsersUseCase implements IUseCase<ISearchUsersInput, IUser[]> {
  public constructor(
    @inject(IUserRepo) private readonly userRepo: IUserRepo,
  ) { }

  public async execute(query: ISearchUsersInput): Promise<IUser[]> {
    const users = await this.userRepo.search(query);

    return users;
  }
}
