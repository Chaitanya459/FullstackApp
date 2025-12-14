import { ITherapistDistrict } from 'types';
import {
  AllowNull,
  AutoIncrement,
  BelongsTo,
  Column,
  CreatedAt,
  DataType,
  Default,
  ForeignKey,
  PrimaryKey,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';
import { AuditedModel } from '../../AuditedModel';
import { UserModel } from '../identity';
import { DistrictModel } from '../organization';
import { ServiceTypeModel } from '../reference';

@Table({
  schema: `services`,
  tableName: `therapist_districts`,
  timestamps: true,
})
export class TherapistDistrictModel extends AuditedModel<ITherapistDistrict> implements ITherapistDistrict {
  @AutoIncrement
  @PrimaryKey
  @Column({ autoIncrementIdentity: true })
  public id: number;

  @AllowNull(false)
  @ForeignKey(() => UserModel)
  @Column
  public therapistId: number;

  @AllowNull(false)
  @ForeignKey(() => DistrictModel)
  @Column
  public districtId: number;

  @AllowNull(false)
  @ForeignKey(() => ServiceTypeModel)
  @Column
  public serviceTypeId: number;

  @AllowNull(false)
  @Default(DataType.NOW)
  @Column(DataType.DATEONLY)
  public assignedDate: Date;

  @CreatedAt
  @Column(DataType.DATE)
  public createdAt: Date;

  @UpdatedAt
  @Column(DataType.DATE)
  public updatedAt: Date;

  @BelongsTo(() => UserModel)
  public therapist?: UserModel;

  @BelongsTo(() => DistrictModel)
  public district?: DistrictModel;

  @BelongsTo(() => ServiceTypeModel)
  public serviceType?: ServiceTypeModel;
}

export default TherapistDistrictModel;
