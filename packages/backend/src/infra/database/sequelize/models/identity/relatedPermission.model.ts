import { IRelatedPermission } from 'types';
import { AllowNull, AutoIncrement, Column, ForeignKey, Model, PrimaryKey, Table } from 'sequelize-typescript';
import { PermissionModel } from '..';

@Table({
  schema: `identity`,
  tableName: `related_permissions`,
  timestamps: false,
})
export class RelatedPermissionModel extends Model<IRelatedPermission> implements IRelatedPermission {
  @AutoIncrement
  @PrimaryKey
  @Column({ autoIncrementIdentity: true })
  public id: number;

  @ForeignKey(() => PermissionModel)
  @AllowNull(false)
  @Column
  public permissionId: number;

  @ForeignKey(() => PermissionModel)
  @AllowNull(false)
  @Column
  public relatedPermissionId: number;
}

export default RelatedPermissionModel;
