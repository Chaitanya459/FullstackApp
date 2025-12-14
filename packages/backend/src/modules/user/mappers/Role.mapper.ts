import { RoleDTO } from 'rsd';
import { IRole } from 'types';
import morphism, { createSchema } from 'morphism';
import { PermissionMapper } from '.';

export class RoleMapper {
  public static toDomain(data: RoleDTO): IRole {
    const schema = createSchema<IRole, RoleDTO>({
      id: `id`,
      code: `code`,
      name: `name`,
    });

    return morphism(schema, data);
  }

  public static toDTO(data: IRole): RoleDTO {
    const schema = createSchema<RoleDTO, IRole>({
      id: `id`,
      code: `code`,
      name: `name`,
      permissions: ({ permissions }) => permissions?.map(PermissionMapper.toDTO),
    });

    return morphism(schema, data);
  }
}
