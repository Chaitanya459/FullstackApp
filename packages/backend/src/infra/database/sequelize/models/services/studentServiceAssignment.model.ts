import { IStudentServiceAssignment } from 'types';
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
import { StudentModel } from '../people';
import { AcademicYearModel, ServiceTypeModel } from '../reference';

@Table({
  schema: `services`,
  tableName: `student_service_assignments`,
  timestamps: true,
})
export class StudentServiceAssignmentModel
  extends AuditedModel<IStudentServiceAssignment>
  implements IStudentServiceAssignment {
  @AutoIncrement
  @PrimaryKey
  @Column({ autoIncrementIdentity: true })
  public id: number;

  @AllowNull(false)
  @ForeignKey(() => StudentModel)
  @Column
  public studentId: number;

  @AllowNull
  @ForeignKey(() => AcademicYearModel)
  @Column
  public academicYearId?: number;

  @AllowNull(false)
  @ForeignKey(() => UserModel)
  @Column
  public therapistId: number;

  @AllowNull(false)
  @ForeignKey(() => ServiceTypeModel)
  @Column
  public serviceTypeId: number;

  @AllowNull(false)
  @Default(DataType.NOW)
  @Column(DataType.DATEONLY)
  public entryDate: Date;

  @AllowNull
  @Column(DataType.DATEONLY)
  public exitDate?: Date;

  @AllowNull
  @Column(DataType.TEXT)
  public notes?: string;

  @CreatedAt
  @Column(DataType.DATE)
  public createdAt: Date;

  @UpdatedAt
  @Column(DataType.DATE)
  public updatedAt: Date;

  @BelongsTo(() => StudentModel)
  public student?: StudentModel;

  @BelongsTo(() => UserModel)
  public therapist?: UserModel;

  @BelongsTo(() => ServiceTypeModel)
  public serviceType?: ServiceTypeModel;
}

export default StudentServiceAssignmentModel;
