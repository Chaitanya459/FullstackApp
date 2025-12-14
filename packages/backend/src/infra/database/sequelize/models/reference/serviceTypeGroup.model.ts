import { IServiceTypeGroup } from 'types';
import {
  AllowNull,
  AutoIncrement,
  Column,
  HasMany,
  Model,
  PrimaryKey,
  Table,
  Unique,
} from 'sequelize-typescript';
import { ServiceTypeModel } from '..';

@Table({
  schema: `reference`,
  tableName: `service_type_groups`,
  timestamps: false,
})
export class ServiceTypeGroupModel extends Model<IServiceTypeGroup> implements IServiceTypeGroup {
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

  @HasMany(() => ServiceTypeModel)
  public serviceTypes?: ServiceTypeModel[];
}

export default ServiceTypeGroupModel;
