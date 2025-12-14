import { IDistrict } from 'types';
import {
  AllowNull,
  AutoIncrement,
  Column,
  CreatedAt,
  DataType,
  HasMany,
  PrimaryKey,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';
import { BuildingModel, DocumentationModel, StudentEnrollmentModel, TherapistDistrictModel } from '..';
import { AuditedModel } from '../../AuditedModel';

@Table({
  schema: `organization`,
  tableName: `districts`,
  timestamps: true,
})
export class DistrictModel extends AuditedModel<IDistrict> implements IDistrict {
  @AutoIncrement
  @PrimaryKey
  @Column({ autoIncrementIdentity: true })
  public id: number;

  @AllowNull(false)
  @Column
  public name: string;

  @AllowNull
  @Column
  public escName?: string;

  @CreatedAt
  @Column(DataType.DATE)
  public createdAt: Date;

  @UpdatedAt
  @Column(DataType.DATE)
  public updatedAt: Date;

  @HasMany(() => BuildingModel)
  public buildings?: BuildingModel[];

  @HasMany(() => TherapistDistrictModel)
  public therapistDistricts?: TherapistDistrictModel[];

  @HasMany(() => StudentEnrollmentModel, `billingDistrictId`)
  public billingEnrollments?: StudentEnrollmentModel[];

  @HasMany(() => StudentEnrollmentModel, `districtOfAttendanceId`)
  public attendanceEnrollments?: StudentEnrollmentModel[];

  @HasMany(() => StudentEnrollmentModel, `districtOfResidenceId`)
  public residenceEnrollments?: StudentEnrollmentModel[];

  @HasMany(() => DocumentationModel, `billingDistrictId`)
  public documentation?: DocumentationModel[];
}

export default DistrictModel;
