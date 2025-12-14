import { Conflict } from 'http-errors';
import { ActorId, IUseCase, IUser } from 'types';
import { inject, injectable } from 'inversify';
import { IUserRepo } from '../repos';
import { UserCreated } from '../../events/UserCreated';
import { EventEmitter } from '../../../../infra/events';

export interface ICreateUserInput {
  user: IUser;
}

@injectable()
export class CreateUserUseCase implements IUseCase<ICreateUserInput, IUser> {
  public constructor(
    @inject(IUserRepo) private readonly userRepo: IUserRepo,
    @inject(EventEmitter) private readonly eventEmitter: EventEmitter,
  ) {}

  public async execute({ user }: ICreateUserInput, actorId: ActorId): Promise<IUser> {
    const roleIds = user.roles?.map((role) => role.id) || [];
    const serviceTypeGroupIds = user.serviceTypeGroups?.map((group) => group.id) || [];
    const serviceTypeIds = user.serviceTypes?.map((service) => service.id) || [];

    delete user.roles;
    delete user.serviceTypes;
    delete user.serviceTypeGroups;

    user.email = user.email.trim().toLowerCase();

    const exist = await this.userRepo.exists(user.email);
    if (exist) {
      throw new Conflict(`User already exists`);
    }

    user.password = `user has not set their password`;
    const newUser = await this.userRepo.create(user, actorId);

    await this.userRepo.setRoles(newUser.id, roleIds, actorId);
    await this.userRepo.setServiceTypeGroups(newUser.id, serviceTypeGroupIds, actorId);
    await this.userRepo.setServiceTypes(newUser.id, serviceTypeIds, actorId);

    this.eventEmitter.publish(new UserCreated({
      createdBy: actorId,
      user: newUser,
    }));

    return this.userRepo.getById(newUser.id);
  }
}
