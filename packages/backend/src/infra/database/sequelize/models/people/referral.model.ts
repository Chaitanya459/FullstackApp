import { IReferral } from 'types';
import {
  AllowNull,
  AutoIncrement,
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { AuditedModel } from '../../AuditedModel';
import { UserModel } from '../identity/user.model';
import { DistrictModel, GenderModel, GradeLevelModel, StateModel } from '..';
import { ReferralStatusModel } from '../reference/referralStatus.model';
import { ReferralStatusHistoryModel } from './referralStatusHistory.model';

@Table({
  paranoid: true,
  schema: `people`,
  tableName: `referrals`,
})
export class ReferralModel extends AuditedModel<IReferral> implements IReferral {
  @AutoIncrement
  @PrimaryKey
  @Column({ autoIncrementIdentity: true })
  public id: number;

  @AllowNull
  @Column
  public email: string;

  @AllowNull
  @Column
  public studentName: string;

  @AllowNull
  @Column
  public personRequestingService: string;

  @AllowNull
  @Column
  public phoneNumber: string;

  @AllowNull
  @ForeignKey(() => DistrictModel)
  @Column
  public districtOfServiceId: number;

  @AllowNull
  @Column
  public districtRepresentativeName: string;

  @AllowNull
  @ForeignKey(() => DistrictModel)
  @Column
  public districtOfResidenceId: number;

  @AllowNull
  @ForeignKey(() => DistrictModel)
  @Column
  public billingDistrictId: number;

  @AllowNull
  @Column
  public buildingAttending: string;

  @AllowNull
  @ForeignKey(() => GradeLevelModel)
  @Column
  public gradeLevelId: number;

  @AllowNull
  @Column(DataType.DATEONLY)
  public studentDateOfBirth: Date;

  @AllowNull
  @ForeignKey(() => GenderModel)
  @Column
  public genderId: number;

  @AllowNull
  @Column
  public city: string;

  @AllowNull
  @Column
  public zipCode: string;

  @AllowNull
  @ForeignKey(() => StateModel)
  @Column
  public stateId: number;

  @AllowNull
  @Column
  public parentGuardianName: string;

  @AllowNull
  @Column
  public parentGuardianPhoneNumber: string;

  @AllowNull
  @Column
  public completedAt?: Date;

  @ForeignKey(() => ReferralStatusModel)
  @AllowNull(false)
  @Column
  public statusId: number;

  @Column
  @ForeignKey(() => UserModel)
  public statusBy: number;

  @Column(DataType.DATE)
  public statusAt: Date;

  @BelongsTo(() => GradeLevelModel)
  public gradeLevel?: GradeLevelModel;

  @BelongsTo(() => GenderModel)
  public gender?: GenderModel;

  @BelongsTo(() => StateModel)
  public state?: StateModel;

  @BelongsTo(() => DistrictModel)
  public districtOfService?: DistrictModel;

  @BelongsTo(() => ReferralStatusModel)
  public status?: ReferralStatusModel;

  @BelongsTo(() => UserModel)
  public statusCreator?: UserModel;

  @HasMany(() => ReferralStatusHistoryModel)
  public history?: ReferralStatusHistoryModel[];
}

export default ReferralModel;
