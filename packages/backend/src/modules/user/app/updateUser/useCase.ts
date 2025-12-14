import { NotFound } from 'http-errors';
import { ActorId, IUseCase, IUser } from 'types';
import { inject, injectable } from 'inversify';
import { IUserRepo } from '../repos';

export interface IUpdateUserInput {
  id: number;
  user: Omit<Partial<IUser>, `id`>;
}

@injectable()
export class UpdateUserUseCase implements IUseCase<IUpdateUserInput, IUser> {
  public constructor(
    @inject(IUserRepo) private readonly userRepo: IUserRepo,
  ) { }

  public async execute({ id, user }: IUpdateUserInput, actorId: ActorId): Promise<IUser> {
    delete user.email;

    const roleIds = user.roles?.map((role) => role.id) || [];
    const serviceTypeGroupIds = user.serviceTypeGroups?.map((group) => group.id) || [];
    const serviceTypeIds = user.serviceTypes?.map((service) => service.id) || [];

    delete user.roles;
    delete user.serviceTypes;
    delete user.serviceTypeGroups;

    const updatedUser = await this.userRepo.update({ ...user, id }, actorId);

    if (!updatedUser) {
      throw new NotFound(`Failed to find user`);
    }

    await this.userRepo.setRoles(id, roleIds, actorId);
    await this.userRepo.setServiceTypeGroups(id, serviceTypeGroupIds, actorId);
    await this.userRepo.setServiceTypes(id, serviceTypeIds, actorId);

    return this.userRepo.getById(id);
  }
}
