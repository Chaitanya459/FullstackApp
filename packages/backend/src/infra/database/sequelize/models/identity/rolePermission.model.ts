import { IRolePermission } from 'types';
import {
  AllowNull,
  AutoIncrement,
  BelongsTo,
  Column,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { PermissionModel, RoleModel } from '..';

@Table({
  schema: `identity`,
  tableName: `role_permissions`,
  timestamps: false,
})
export class RolePermissionModel extends Model<IRolePermission> implements IRolePermission {
  @AutoIncrement
  @PrimaryKey
  @Column({ autoIncrementIdentity: true })
  public id: number;

  @ForeignKey(() => PermissionModel)
  @AllowNull(false)
  @Column
  public permissionId: number;

  @BelongsTo(() => PermissionModel)
  public permission: PermissionModel;

  @ForeignKey(() => RoleModel)
  @AllowNull(false)
  @Column
  public roleId: number;

  @BelongsTo(() => RoleModel)
  public role: RoleModel;
}

export default RolePermissionModel;
