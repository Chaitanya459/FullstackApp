import {
  AllowNull,
  AutoIncrement,
  BelongsTo,
  Column,
  CreatedAt,
  DataType,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { IReferralStatusHistory } from 'types';
import { ReferralModel, ReferralStatusModel, UserModel } from '..';

@Table({
  schema: `people`,
  tableName: `referral_status_history`,
  timestamps: false,
})
export class ReferralStatusHistoryModel extends Model<IReferralStatusHistory> implements IReferralStatusHistory {
  @AutoIncrement
  @PrimaryKey
  @Column
  public id: number;

  @ForeignKey(() => ReferralModel)
  @AllowNull(false)
  @Column
  public referralId: number;

  @ForeignKey(() => ReferralStatusModel)
  @AllowNull(false)
  @Column
  public statusId: number;

  @AllowNull(false)
  @Column
  public createdBy: number;

  @CreatedAt
  @Column(DataType.DATE)
  public readonly createdAt: Date;

  @BelongsTo(() => ReferralStatusModel)
  public status: ReferralStatusModel;

  @BelongsTo(() => UserModel, { foreignKey: `createdBy` })
  public readonly creator: UserModel;
}

export default ReferralStatusHistoryModel;
