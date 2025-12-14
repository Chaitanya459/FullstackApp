import { IDocumentation } from 'types';
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
import { StudentModel } from '../people';
import { ServiceTypeModel } from '../reference';

@Table({
  schema: `services`,
  tableName: `documentation`,
  timestamps: true,
})
export class DocumentationModel extends AuditedModel<IDocumentation> implements IDocumentation {
  @AutoIncrement
  @PrimaryKey
  @Column(DataType.UUID)
  public id: string;

  @AllowNull(true)
  @ForeignKey(() => StudentModel)
  @Column
  public studentId?: number;

  @AllowNull(false)
  @ForeignKey(() => UserModel)
  @Column
  public therapistId: number;

  @AllowNull(false)
  @ForeignKey(() => DistrictModel)
  @Column
  public billingDistrictId: number;

  @AllowNull
  @Column(DataType.DATEONLY)
  public serviceDate: Date;

  @AllowNull
  @Column(DataType.TEXT)
  public caseNotes?: string;

  @AllowNull(false)
  @Default(0)
  @Column
  public directMinutes: number;

  @AllowNull(false)
  @Default(0)
  @Column
  public indirectMinutes: number;

  @AllowNull
  @Column(DataType.ARRAY(DataType.TEXT))
  public selectedGoals: string[];

  @AllowNull(false)
  @Default(0)
  @Column
  public travelMinutes: number;

  @AllowNull(true)
  @ForeignKey(() => ServiceTypeModel)
  @Column
  public serviceTypeId: number;

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

  @BelongsTo(() => DistrictModel)
  public billingDistrict?: DistrictModel;

  @BelongsTo(() => ServiceTypeModel)
  public serviceType?: ServiceTypeModel;

  @AllowNull
  @Column(DataType.DATE)
  public submittedOn?: Date;
}

export default DocumentationModel;
