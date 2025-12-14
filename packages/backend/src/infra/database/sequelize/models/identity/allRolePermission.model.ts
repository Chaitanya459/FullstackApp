import { IAllRolePermission } from 'types';
import { AllowNull, AutoIncrement, Column, ForeignKey, Model, PrimaryKey, Table } from 'sequelize-typescript';
import { RoleModel } from '..';

@Table({
  schema: `identity`,
  tableName: `all_role_permissions`,
  timestamps: false,
})
export class AllRolePermissionModel extends Model<IAllRolePermission> implements IAllRolePermission {
  @AutoIncrement
  @PrimaryKey
  @Column({ autoIncrementIdentity: true })
  public id: number;

  @AllowNull(false)
  @Column
  public action: string;

  @AllowNull(false)
  @Column
  public subject: string;

  @AllowNull(false)
  @Column
  public inverted: boolean;

  @ForeignKey(() => RoleModel)
  @AllowNull(false)
  @Column
  public roleId: number;
}

export default AllRolePermissionModel;
