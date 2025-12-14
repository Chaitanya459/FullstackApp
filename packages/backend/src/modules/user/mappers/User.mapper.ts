import { UserDTO } from 'rsd';
import { IUser } from 'types';
import morphism, { createSchema } from 'morphism';
import { sortBy, uniqBy } from 'lodash';
import { ServiceTypeGroupMapper, ServiceTypeMapper } from '../../reference/mappers';
import { RoleMapper } from '.';

export class UserMapper {
  public static toDomain(data: UserDTO): IUser {
    const schema = createSchema<IUser, UserDTO>({
      id: `id`,
      createdAt: `createdAt`,
      createdBy: `createdBy`,
      deletedAt: `deletedAt`,
      deletedBy: `deletedBy`,
      email: `email`,
      firstName: `firstName`,
      lastName: `lastName`,
      lockedAt: `lockedAt`,
      loginAttempts: `loginAttempts`,
      name: `name`,
      password: () => undefined,
      roles: ({ roles }: UserDTO) => roles?.map(RoleMapper.toDomain),
      serviceTypeGroups: ({ serviceTypeGroups }) => serviceTypeGroups?.map(ServiceTypeGroupMapper.toDomain),
      serviceTypes: ({ serviceTypes }) => serviceTypes?.map(ServiceTypeMapper.toDomain),
      updatedAt: `updatedAt`,
      updatedBy: `updatedBy`,
    });

    return morphism(schema, data);
  }

  public static toDTO(data: IUser): UserDTO {
    const schema = createSchema<UserDTO, IUser>({
      id: `id`,
      createdAt: `createdAt`,
      createdBy: `createdBy`,
      creator: ({ creator }) => UserMapper.toDTO(creator),
      deletedAt: `deletedAt`,
      deletedBy: `deletedBy`,
      deletor: ({ deletor }) => UserMapper.toDTO(deletor),
      email: `email`,
      firstName: `firstName`,
      lastName: `lastName`,
      lockedAt: `lockedAt`,
      loginAttempts: `loginAttempts`,
      name: `name`,
      permissions: ({ roles }) => sortBy(
        uniqBy(
          roles?.flatMap((role) => role.permissions),
          `id`,
        ),
        [ `inverted`, `id` ],
      ),
      roles: ({ roles }) => roles?.map(RoleMapper.toDTO),
      serviceTypeGroups: ({ serviceTypeGroups }) => serviceTypeGroups?.map(ServiceTypeGroupMapper.toDTO),
      serviceTypes: ({ serviceTypes }) => serviceTypes?.map(ServiceTypeMapper.toDTO),
      updatedAt: `updatedAt`,
      updatedBy: `updatedBy`,
      updater: ({ updater }) => UserMapper.toDTO(updater),
    });

    return morphism(schema, data);
  }
}
