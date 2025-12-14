import { IUserRole } from 'types';
import { AllowNull, AutoIncrement, Column, ForeignKey, PrimaryKey, Table } from 'sequelize-typescript';
import { AuditedModel } from '../../AuditedModel';
import { RoleModel, UserModel } from '..';

@Table({
  paranoid: true,
  schema: `identity`,
  tableName: `user_roles`,
})
export class UserRoleModel extends AuditedModel<IUserRole> implements IUserRole {
  @AutoIncrement
  @PrimaryKey
  @Column({ autoIncrementIdentity: true })
  public id: number;

  @ForeignKey(() => UserModel)
  @AllowNull(false)
  @Column
  public userId: number;

  @ForeignKey(() => RoleModel)
  @AllowNull(false)
  @Column
  public roleId: number;
}

export default UserRoleModel;
