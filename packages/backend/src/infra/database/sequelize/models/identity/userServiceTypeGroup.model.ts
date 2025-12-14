import {
  AllowNull,
  AutoIncrement,
  BelongsTo,
  Column,
  ForeignKey,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { ServiceTypeGroupModel, UserModel } from '..';
import { IUserServiceTypeGroup } from '../../../../../types';
import { AuditedModel } from '../../AuditedModel';

@Table({
  paranoid: true,
  schema: `identity`,
  tableName: `user_service_type_groups`,
  timestamps: true,
})
export class UserServiceTypeGroupModel extends AuditedModel<IUserServiceTypeGroup> implements IUserServiceTypeGroup {
  @AutoIncrement
  @PrimaryKey
  @Column({ autoIncrementIdentity: true })
  public id: number;

  @AllowNull(false)
  @ForeignKey(() => UserModel)
  @Column
  public userId: number;

  @AllowNull(false)
  @ForeignKey(() => ServiceTypeGroupModel)
  @Column
  public serviceTypeGroupId: number;

  @BelongsTo(() => UserModel)
  public user?: UserModel;

  @BelongsTo(() => ServiceTypeGroupModel)
  public serviceTypeGroup?: ServiceTypeGroupModel;
}

export default UserServiceTypeGroupModel;
