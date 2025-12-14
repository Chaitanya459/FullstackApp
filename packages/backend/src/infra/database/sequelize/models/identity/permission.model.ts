import { IPermission } from 'types';
import { AllowNull, AutoIncrement, Column, ForeignKey, Model, PrimaryKey, Table } from 'sequelize-typescript';
import { ActionModel, SubjectModel } from '..';

@Table({
  schema: `identity`,
  tableName: `permissions`,
  timestamps: false,
})
export class PermissionModel extends Model<IPermission> implements IPermission {
  @AutoIncrement
  @PrimaryKey
  @Column({ autoIncrementIdentity: true })
  public id: number;

  @ForeignKey(() => ActionModel)
  @AllowNull(false)
  @Column
  public actionId: number;

  @ForeignKey(() => SubjectModel)
  @AllowNull(false)
  @Column
  public subjectId: number;

  @AllowNull(false)
  @Column
  public inverted: boolean;
}

export default PermissionModel;
