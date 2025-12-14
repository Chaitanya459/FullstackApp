import { IAction } from 'types';
import { AllowNull, AutoIncrement, Column, Model, PrimaryKey, Table } from 'sequelize-typescript';

@Table({
  schema: `identity`,
  tableName: `actions`,
  timestamps: false,
})
export class ActionModel extends Model<IAction> implements IAction {
  @AutoIncrement
  @PrimaryKey
  @Column({ autoIncrementIdentity: true })
  public id: number;

  @AllowNull(false)
  @Column
  public code: string;

  @AllowNull(false)
  @Column
  public name: string;
}

export default ActionModel;
