import { IAction } from 'types';
import { AllowNull, AutoIncrement, Column, Model, PrimaryKey, Table } from 'sequelize-typescript';

@Table({
  schema: `identity`,
  tableName: `subjects`,
  timestamps: false,
})
export class SubjectModel extends Model<IAction> implements IAction {
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

  @AllowNull(false)
  @Column
  public active: boolean;
}

export default SubjectModel;
