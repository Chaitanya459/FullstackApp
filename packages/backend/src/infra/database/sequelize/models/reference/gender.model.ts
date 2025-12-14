import { IGender } from 'types';
import {
  AllowNull,
  AutoIncrement,
  Column,
  Model,
  PrimaryKey,
  Table,
  Unique,
} from 'sequelize-typescript';

@Table({
  schema: `reference`,
  tableName: `genders`,
  timestamps: false,
})
export class GenderModel extends Model<IGender> implements IGender {
  @AutoIncrement
  @PrimaryKey
  @Column({ autoIncrementIdentity: true })
  public id: number;

  @AllowNull(false)
  @Unique
  @Column
  public name: string;
}

export default GenderModel;
