import { IState } from 'types';
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
  tableName: `states`,
  timestamps: false,
})
export class StateModel extends Model<IState> implements IState {
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
}

export default StateModel;
