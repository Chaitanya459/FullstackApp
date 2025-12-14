import { createSchema, morphism } from 'morphism';
import { PermissionDTO } from 'rsd';
import { IAllRolePermission } from 'types';

export class PermissionMapper {
  public static toDomain(data: PermissionDTO): IAllRolePermission {
    const schema = createSchema<IAllRolePermission, PermissionDTO>({
      id: `id`,
      action: `action`,
      inverted: `inverted`,
      roleId: `roleId`,
      subject: `subject`,
    });

    return morphism(schema, data);
  }

  public static toDTO(data: IAllRolePermission): PermissionDTO {
    const schema = createSchema<PermissionDTO, IAllRolePermission>({
      id: `id`,
      action: `action`,
      inverted: `inverted`,
      roleId: `roleId`,
      subject: `subject`,
    });

    return morphism(schema, data);
  }
}
