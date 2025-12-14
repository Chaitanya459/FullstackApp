import {
  BelongsToManyAddAssociationsMixin,
  BelongsToManySetAssociationsMixin,
  DataTypes,
} from 'sequelize';
import { IUser } from 'types';
import {
  AllowNull,
  AutoIncrement,
  BelongsToMany,
  Column,
  DataType,
  HasMany,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import {
  DocumentationModel,
  RoleModel,
  ServiceTypeGroupModel,
  ServiceTypeModel,
  StudentServiceAssignmentModel,
  TherapistDistrictModel,
  TherapistServiceDistrictModel,
  UserRoleModel,
  UserServiceTypeGroupModel,
  UserServiceTypeModel,
} from '..';
import { AuditedModel } from '../../AuditedModel';

@Table({
  defaultScope: {
    attributes: { exclude: [ `password` ] },
  },
  paranoid: true,
  schema: `identity`,
  tableName: `users`,
})
export class UserModel extends AuditedModel<IUser> implements IUser {
  @AutoIncrement
  @PrimaryKey
  @Column({ autoIncrementIdentity: true })
  public id: number;

  @Column(DataTypes.VIRTUAL)
  public get name(): string {
    const { firstName, lastName } = this;
    return `${firstName} ${lastName}`;
  }

  @AllowNull(false)
  @Column
  public firstName: string;

  @AllowNull(false)
  @Column
  public lastName: string;

  @AllowNull(false)
  @Column
  public email: string;

  @AllowNull
  @Column
  public password: string;

  @BelongsToMany(() => RoleModel, () => UserRoleModel)
  public roles?: RoleModel[];

  @AllowNull
  @Column(DataType.INTEGER)
  public loginAttempts: number | null;

  @AllowNull
  @Column(DataType.DATE)
  public lockedAt: Date | null;

  @HasMany(() => TherapistDistrictModel, `therapistId`)
  public therapistDistricts?: TherapistDistrictModel[];

  @HasMany(() => StudentServiceAssignmentModel, `therapistId`)
  public studentServiceAssignments?: StudentServiceAssignmentModel[];

  @HasMany(() => DocumentationModel, `therapistId`)
  public documentation?: DocumentationModel[];

  @BelongsToMany(() => ServiceTypeModel, () => UserServiceTypeModel)
  public serviceTypes?: ServiceTypeModel[];

  @BelongsToMany(() => ServiceTypeGroupModel, () => UserServiceTypeGroupModel)
  public serviceTypeGroups?: ServiceTypeGroupModel[];

  @HasMany(() => TherapistServiceDistrictModel, `therapistId`)
  public therapistServiceDistricts?: TherapistServiceDistrictModel[];

  public addRoles: BelongsToManyAddAssociationsMixin<RoleModel, number>;
  public setRoles: BelongsToManySetAssociationsMixin<RoleModel, number>;
  public setServiceTypes: BelongsToManySetAssociationsMixin<ServiceTypeModel, number>;
  public setServiceTypeGroups: BelongsToManySetAssociationsMixin<ServiceTypeGroupModel, number>;
}

export default UserModel;
