import { IStudent } from 'types';
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
import {
  DocumentationModel,
  DocumentationMonthlySummaryModel,
  StudentEnrollmentModel,
  StudentServiceAssignmentModel,
} from '..';
import { AuditedModel } from '../../AuditedModel';

@Table({
  schema: `people`,
  tableName: `students`,
  timestamps: true,
})
export class StudentModel extends AuditedModel<IStudent> implements IStudent {
  @AutoIncrement
  @PrimaryKey
  @Column({ autoIncrementIdentity: true })
  public id: number;

  @AllowNull(false)
  @Column
  public firstName: string;

  @AllowNull(false)
  @Column
  public lastName: string;

  @AllowNull
  @Column(DataType.DATEONLY)
  public dateOfBirth?: Date;

  @AllowNull
  @Column
  public county?: string;

  @CreatedAt
  @Column(DataType.DATE)
  public createdAt: Date;

  @UpdatedAt
  @Column(DataType.DATE)
  public updatedAt: Date;

  @HasMany(() => StudentEnrollmentModel)
  public enrollments?: StudentEnrollmentModel[];

  @HasMany(() => StudentServiceAssignmentModel)
  public serviceAssignments?: StudentServiceAssignmentModel[];

  @HasMany(() => DocumentationModel)
  public documentation?: DocumentationModel[];

  @HasMany(() => DocumentationMonthlySummaryModel, `studentId`)
  public documentationMonthlySummary?: DocumentationMonthlySummaryModel[];
}

export default StudentModel;
