import {
  AllowNull,
  AutoIncrement,
  BelongsTo,
  Column,
  ForeignKey,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { ServiceTypeModel, UserModel } from '..';
import { IUserServiceType } from '../../../../../types';
import { AuditedModel } from '../../AuditedModel';

@Table({
  paranoid: true,
  schema: `identity`,
  tableName: `user_service_types`,
  timestamps: true,
})
export class UserServiceTypeModel extends AuditedModel<IUserServiceType> implements IUserServiceType {
  @AutoIncrement
  @PrimaryKey
  @Column({ autoIncrementIdentity: true })
  public id: number;

  @AllowNull(false)
  @ForeignKey(() => UserModel)
  @Column
  public userId: number;

  @AllowNull(false)
  @ForeignKey(() => ServiceTypeModel)
  @Column
  public serviceTypeId: number;

  @BelongsTo(() => UserModel)
  public user?: UserModel;

  @BelongsTo(() => ServiceTypeModel)
  public serviceType?: ServiceTypeModel;
}

export default UserServiceTypeModel;
