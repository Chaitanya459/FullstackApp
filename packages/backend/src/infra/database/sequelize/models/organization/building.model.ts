import { IBuilding } from 'types';
import {
  AllowNull,
  AutoIncrement,
  BelongsTo,
  Column,
  CreatedAt,
  DataType,
  ForeignKey,
  HasMany,
  PrimaryKey,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';
import { DistrictModel, StudentEnrollmentModel } from '..';
import { AuditedModel } from '../../AuditedModel';

@Table({
  schema: `organization`,
  tableName: `buildings`,
  timestamps: true,
})
export class BuildingModel extends AuditedModel<IBuilding> implements IBuilding {
  @AutoIncrement
  @PrimaryKey
  @Column({ autoIncrementIdentity: true })
  public id: number;

  @AllowNull(false)
  @Column
  public name: string;

  @AllowNull(true)
  @Column
  public phoneNumber: string;

  @AllowNull(false)
  @ForeignKey(() => DistrictModel)
  @Column
  public districtId: number;

  @CreatedAt
  @Column(DataType.DATE)
  public createdAt: Date;

  @UpdatedAt
  @Column(DataType.DATE)
  public updatedAt: Date;

  @BelongsTo(() => DistrictModel)
  public district?: DistrictModel;

  @HasMany(() => StudentEnrollmentModel)
  public enrollments?: StudentEnrollmentModel[];
}

export default BuildingModel;
