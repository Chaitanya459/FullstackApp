import Sequelize, { Op } from 'sequelize';
import { ActorId, IUser } from 'types';
import { injectable } from 'inversify';
import sequelize from '../../../../infra/database/sequelize';
import { IGetUsersOptions, IUserRepo } from '../../app/repos';
import { UserModel } from '../../../../infra/database/sequelize/models';

@injectable()
export class UserRepo implements IUserRepo {
  public async exists(email: string, id?: number): Promise<boolean> {
    const user = await UserModel.findOne({
      where: {
        ...id && { id: { [Op.not]: id } },
        email,
      },
    });
    const found = !!user;
    return found;
  }

  public async search(opts: IGetUsersOptions = {}): Promise<IUser[]> {
    const { role, withDeleted, withPermissions, ...where } = opts;

    const users = await UserModel.findAll({
      include: [
        {
          association: `roles`,
          include: [
            ...withPermissions ? [ `permissions` ] : [],
          ],
          where: role ? {
            [Op.or]: [
              Sequelize.where(
                Sequelize.fn(`lower`, Sequelize.col(`name`)), { [Op.like]: `%${role.toLowerCase()}%` },
              ),
              Sequelize.where(
                Sequelize.fn(`lower`, Sequelize.col(`code`)), { [Op.like]: `%${role.toLowerCase()}%` },
              ),
            ],
          } : undefined,
        },
        `serviceTypes`,
        `serviceTypeGroups`,
      ],
      order: [[ `id`, `DESC` ]],
      paranoid: !withDeleted,
      where: {
        ...where.email && { email: where.email },
        ...where.name && {
          [Op.or]: [
            Sequelize.where(
              Sequelize.fn(`lower`, Sequelize.col(`UserModel.first_name`)),
              { [Op.like]: `%${where.name.toLowerCase()}%` },
            ),
            Sequelize.where(
              Sequelize.fn(`lower`, Sequelize.col(`UserModel.last_name`)),
              { [Op.like]: `%${where.name.toLowerCase()}%` },
            ),
          ],
        },
      },
    });

    return users;
  }

  public async getById(userId: number, opts: IGetUsersOptions = {}): Promise<IUser> {
    const include = [
      `creator`,
      `updater`,
      {
        association: `roles`,
        include: [ ...opts.withPermissions ? [ `permissions` ] : [] ],
      },
      `serviceTypes`,
      `serviceTypeGroups`,
      ...opts.withDeleted ? [ `deletor` ] : [],
    ];

    const user = await UserModel.findByPk(userId, {
      include,
      paranoid: false,
    });

    if (!user) {
      throw new Error(`User with id ${userId} not found`);
    }

    return user.get({ plain: true });
  }

  public async getByEmailWithPassword(email: string): Promise<IUser | null> {
    const user = await UserModel.scope(null).findOne({
      include: [
        {
          association: `roles`,
          include: [ `permissions` ],
        },
      ],
      where: Sequelize.or(
        Sequelize.where(Sequelize.fn(`lower`, Sequelize.col(`email`)), email.toLowerCase()),
      ),
    });

    if (!user) {
      return null;
    }

    return user;
  }

  public async getByEmail(email: string): Promise<IUser | null> {
    const user = await UserModel.findOne({
      where: Sequelize.where(Sequelize.fn(`lower`, Sequelize.col(`email`)), email),
    });

    if (!user) {
      return null;
    }

    return user;
  }

  public async create(data: Omit<IUser, `id`>, actorId: ActorId): Promise<IUser> {
    const res = await sequelize.transaction(async (transaction) => {
      const user = await UserModel.create(data, { actorId, transaction });
      await user.addRoles(data.roles?.map((r) => r.id), { actorId, transaction });
      return user;
    });

    return res;
  }

  public async update(user: IUser, actorId: ActorId): Promise<IUser> {
    const transaction = await sequelize.transaction();

    const [ , [ updatedUser ]] = await UserModel.update(user, {
      actorId,
      returning: true,
      transaction,
      where: {
        id: user.id,
      },
    });

    if (user.roles?.length) {
      await updatedUser.setRoles(
        user.roles.map((role) => role.id),
        {
          actorId,
          transaction,
        },
      );
    }

    await transaction.commit();

    return updatedUser;
  }

  public async delete(userId: number, actorId: ActorId): Promise<void> {
    const res = await UserModel.destroy({
      actorId,
      where: {
        id: userId,
      },
    });

    if (!res) {
      throw new Error(`User with id ${userId} does not exist`);
    }
  }

  public async restore(userId: number, actorId: ActorId): Promise<void> {
    await UserModel.restore({
      actorId,
      where: {
        id: userId,
      },
    });
  }

  public async setRoles(userId: number, roleIds: number[], actorId: ActorId): Promise<void> {
    const user = await UserModel.findByPk(userId);

    if (!user) {
      throw new Error(`User with id ${userId} not found`);
    }

    await user.setRoles(roleIds, { actorId });
  }

  public async setServiceTypeGroups(userId: number, serviceTypeGroupIds: number[], actorId: ActorId): Promise<void> {
    const user = await UserModel.findByPk(userId);

    if (!user) {
      throw new Error(`User with id ${userId} not found`);
    }

    await user.setServiceTypeGroups(serviceTypeGroupIds, { actorId });
  }

  public async setServiceTypes(userId: number, serviceTypeIds: number[], actorId: ActorId): Promise<void> {
    const user = await UserModel.findByPk(userId);

    if (!user) {
      throw new Error(`User with id ${userId} not found`);
    }

    await user.setServiceTypes(serviceTypeIds, { actorId });
  }
}
