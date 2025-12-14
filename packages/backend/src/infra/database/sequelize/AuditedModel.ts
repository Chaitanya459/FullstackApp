import {
  BulkCreateOptions,
  CreateOptions,
  DestroyOptions,
  RestoreOptions,
  UpdateOptions,
  UpsertOptions,
} from 'sequelize';
import {
  AllowNull,
  BeforeBulkCreate,
  BeforeBulkDestroy,
  BeforeBulkRestore,
  BeforeBulkUpdate,
  BeforeCreate,
  BeforeDestroy,
  BeforeRestore,
  BeforeUpdate,
  BeforeUpsert,
  BelongsTo,
  Column,
  CreatedAt,
  DataType,
  DeletedAt,
  Model,
  UpdatedAt,
} from 'sequelize-typescript';
import { IAudited } from '../../../types';
import { UserModel } from './models';

type Audited<T> = T & IAudited;

export class AuditedModel<T = Record<string, null>> extends Model<Audited<T>> {
  @Column
  public createdBy: number;

  @CreatedAt
  public readonly createdAt: Date;

  @Column
  public updatedBy: number;

  @UpdatedAt
  public readonly updatedAt: Date;

  @AllowNull
  @Column(DataType.INTEGER)
  public deletedBy?: number | null;

  @DeletedAt
  public readonly deletedAt?: Date;

  @BelongsTo(() => UserModel, { foreignKey: `createdBy` })
  public readonly creator: UserModel;

  @BelongsTo(() => UserModel, { foreignKey: `updatedBy` })
  public readonly updater: UserModel;

  @BelongsTo(() => UserModel, { foreignKey: `deletedBy` })
  public readonly deletor?: UserModel;

  @BeforeBulkCreate
  public static auditBeforeBulkCreate(models, options: BulkCreateOptions) {
    options.individualHooks = true;
  }

  @BeforeBulkDestroy
  public static auditBeforeBulkDestroy(options: DestroyOptions) {
    options.individualHooks = true;
  }

  @BeforeBulkRestore
  public static auditBeforeBulkRestore(options: RestoreOptions) {
    options.individualHooks = true;
  }

  @BeforeBulkUpdate
  public static auditBeforeBulkUpdateBeforeBulkUpdate(options: UpdateOptions) {
    options.individualHooks = true;
  }

  @BeforeCreate
  public static auditBeforeCreate(model: AuditedModel, options: CreateOptions) {
    if (!options.actorId) {
      throw new Error(`Must include actorId option`);
    }
    model.createdBy = options.actorId;
    model.updatedBy = options.actorId;
  }

  @BeforeDestroy
  public static auditBeforeDestroy(model: AuditedModel, options: DestroyOptions) {
    if (!options.actorId) {
      throw new Error(`Must include actorId option`);
    }
    model.deletedBy = options.actorId;
  }

  @BeforeRestore
  public static auditBeforeRestore(model: AuditedModel, options: RestoreOptions) {
    if (!options.actorId) {
      throw new Error(`Must include actorId option`);
    }
    model.updatedBy = options.actorId;
    model.deletedBy = null;
  }

  @BeforeUpdate
  public static auditBeforeUpdate(model: AuditedModel, options: UpdateOptions) {
    if (!options.actorId) {
      throw new Error(`Must include actorId option`);
    }
    model.updatedBy = options.actorId;
  }

  @BeforeUpsert
  public static auditBeforeUpsert(model: AuditedModel, options: UpsertOptions) {
    if (!options.actorId) {
      throw new Error(`Must include actorId option`);
    }
    model.createdBy = options.actorId;
    model.updatedBy = options.actorId;
  }
}
