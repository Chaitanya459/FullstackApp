import {
  AllowNull,
  AutoIncrement,
  Column,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { IReferralStatus } from 'types';

@Table({
  schema: `reference`,
  tableName: `referral_statuses`,
  timestamps: false,
})
export class ReferralStatusModel extends Model<IReferralStatus> implements IReferralStatus {
  @AutoIncrement
  @PrimaryKey
  @Column({ autoIncrementIdentity: true })
  public id: number;

  @AllowNull(false)
  @Column
  public code: string;

  @AllowNull(false)
  @Column
  public name: string;

  @AllowNull
  @Column
  public sortOrder?: number;
}

export default ReferralStatusModel;
