import { IRole } from 'types';
import {
  AllowNull,
  AutoIncrement,
  BelongsToMany,
  Column,
  HasMany,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { AllRolePermissionModel, UserModel, UserRoleModel } from '..';

@Table({
  schema: `identity`,
  tableName: `roles`,
  timestamps: false,
})
export class RoleModel extends Model<IRole> implements IRole {
  @AutoIncrement
  @PrimaryKey
  @Column({ autoIncrementIdentity: true })
  public id: number;

  @AllowNull(false)
  @Column
  public name: string;

  @AllowNull(false)
  @Column
  public code: string;

  @BelongsToMany(() => UserModel, () => UserRoleModel)
  public users?: UserModel[];

  @HasMany(() => AllRolePermissionModel)
  public permissions?: AllRolePermissionModel[];
}

export default RoleModel;
