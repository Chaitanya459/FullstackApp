import {
  AllowNull,
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { ITherapistServiceDistrict } from 'types';
import { ServiceTypeModel } from '../reference';

@Table({
  schema: `services`,
  tableName: `therapist_service_district`,
  timestamps: false,
})
export class TherapistServiceDistrictModel
  extends Model<ITherapistServiceDistrict>
  implements ITherapistServiceDistrict {
  @PrimaryKey
  @Column
  public readonly therapistId: number;

  @PrimaryKey
  @AllowNull(false)
  @Column
  public readonly districtId: number;

  @PrimaryKey
  @AllowNull(true)
  @Column
  public readonly studentId: number | null;

  @AllowNull(false)
  @Column(DataType.DATEONLY)
  public readonly createdAt: Date;

  @AllowNull(true)
  @Column(DataType.DATEONLY)
  public readonly deletedAt: Date | null;

  @AllowNull(false)
  @Column
  public readonly isExternal: boolean;

  @AllowNull(false)
  @ForeignKey(() => ServiceTypeModel)
  @Column
  public readonly serviceTypeId: number;

  @BelongsTo(() => ServiceTypeModel)
  public readonly serviceType?: ServiceTypeModel;
}

export default TherapistServiceDistrictModel;
