import { IServiceType } from 'types';
import {
  AllowNull,
  AutoIncrement,
  BelongsTo,
  Column,
  ForeignKey,
  HasMany,
  Model,
  PrimaryKey,
  Table,
  Unique,
} from 'sequelize-typescript';
import { DocumentationModel, ServiceTypeGroupModel, StudentServiceAssignmentModel, TherapistDistrictModel } from '..';

@Table({
  schema: `reference`,
  tableName: `service_types`,
  timestamps: false,
})
export class ServiceTypeModel extends Model<IServiceType> implements IServiceType {
  @AutoIncrement
  @PrimaryKey
  @Column({ autoIncrementIdentity: true })
  public id: number;

  @AllowNull(false)
  @Unique
  @Column
  public name: string;

  @AllowNull(false)
  @Unique
  @Column
  public code: string;

  @AllowNull(false)
  @ForeignKey(() => ServiceTypeGroupModel)
  @Column
  public serviceTypeGroupId: number;

  @HasMany(() => TherapistDistrictModel)
  public therapistDistricts?: TherapistDistrictModel[];

  @HasMany(() => StudentServiceAssignmentModel)
  public studentServiceAssignments?: StudentServiceAssignmentModel[];

  @HasMany(() => DocumentationModel)
  public documentation?: DocumentationModel[];

  @BelongsTo(() => ServiceTypeGroupModel)
  public serviceTypeGroup?: ServiceTypeGroupModel;
}

export default ServiceTypeModel;
