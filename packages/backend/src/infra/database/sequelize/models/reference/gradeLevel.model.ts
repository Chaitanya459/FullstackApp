import { IGradeLevel } from 'types';
import {
  AllowNull,
  AutoIncrement,
  Column,
  CreatedAt,
  DataType,
  Model,
  PrimaryKey,
  Table,
  Unique,
  UpdatedAt,
} from 'sequelize-typescript';

@Table({
  schema: `reference`,
  tableName: `grade_levels`,
  timestamps: true,
})
export class GradeLevelModel extends Model<IGradeLevel> implements IGradeLevel {
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

  @AllowNull
  @Unique
  @Column
  public order?: number;

  @CreatedAt
  @Column(DataType.DATE)
  public createdAt: Date;

  @UpdatedAt
  @Column(DataType.DATE)
  public updatedAt: Date;
}

export default GradeLevelModel;
