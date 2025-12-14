import { IAcademicYear } from 'types';
import {
  AllowNull,
  AutoIncrement,
  Column,
  DataType,
  Model,
  PrimaryKey,
  Table,
  Unique,
} from 'sequelize-typescript';

@Table({
  schema: `reference`,
  tableName: `academic_years`,
  timestamps: false,
})
export class AcademicYearModel extends Model<IAcademicYear> implements IAcademicYear {
  @AutoIncrement
  @PrimaryKey
  @Column({ autoIncrementIdentity: true })
  public id: number;

  @AllowNull(false)
  @Unique
  @Column
  public name: string;

  @AllowNull(false)
  @Column(DataType.DATE)
  public startDate: Date;

  @AllowNull(false)
  @Column(DataType.DATE)
  public endDate: Date;
}

export default AcademicYearModel;
