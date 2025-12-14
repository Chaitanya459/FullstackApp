import { IStudentEnrollment } from 'types';
import {
  AllowNull,
  AutoIncrement,
  BelongsTo,
  Column,
  DataType,
  Default,
  ForeignKey,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { AuditedModel } from '../../AuditedModel';
import { BuildingModel, DistrictModel } from '../organization';
import { StudentModel } from '../people';
import { AcademicYearModel, GradeLevelModel } from '../reference';

@Table({
  schema: `services`,
  tableName: `student_enrollments`,
  timestamps: true,
})
export class StudentEnrollmentModel extends AuditedModel<IStudentEnrollment> implements IStudentEnrollment {
  @AutoIncrement
  @PrimaryKey
  @Column({ autoIncrementIdentity: true })
  public id: number;

  @AllowNull(false)
  @ForeignKey(() => StudentModel)
  @Column
  public studentId: number;

  @AllowNull(false)
  @ForeignKey(() => GradeLevelModel)
  @Column
  public gradeLevelId: number;

  @AllowNull(false)
  @ForeignKey(() => DistrictModel)
  @Column
  public billingDistrictId: number;

  @AllowNull
  @ForeignKey(() => AcademicYearModel)
  @Column
  public academicYearId?: number;

  @AllowNull
  @ForeignKey(() => BuildingModel)
  @Column
  public buildingId?: number;

  @AllowNull
  @ForeignKey(() => DistrictModel)
  @Column
  public districtOfAttendanceId?: number;

  @AllowNull
  @ForeignKey(() => DistrictModel)
  @Column
  public districtOfResidenceId?: number;

  @AllowNull(false)
  @Default(DataType.NOW)
  @Column(DataType.DATEONLY)
  public enrollmentDate: Date;

  @AllowNull
  @Column(DataType.DATEONLY)
  public exitDate?: Date;

  @AllowNull
  @Column(DataType.NUMBER)
  public roomNumber?: number;

  @AllowNull
  @Column(DataType.STRING)
  public teacherName?: string;

  @BelongsTo(() => GradeLevelModel)
  public gradeLevel?: GradeLevelModel;

  @BelongsTo(() => StudentModel)
  public student?: StudentModel;

  @BelongsTo(() => DistrictModel, `billingDistrictId`)
  public billingDistrict?: DistrictModel;

  @BelongsTo(() => AcademicYearModel)
  public academicYear?: AcademicYearModel;

  @BelongsTo(() => BuildingModel)
  public building?: BuildingModel;

  @BelongsTo(() => DistrictModel, `districtOfAttendanceId`)
  public districtOfAttendance?: DistrictModel;

  @BelongsTo(() => DistrictModel, `districtOfResidenceId`)
  public districtOfResidence?: DistrictModel;
}

export default StudentEnrollmentModel;
