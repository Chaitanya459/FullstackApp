import {
  AllowNull,
  Column,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { Model } from 'sequelize-typescript';
import { IDocumentationMonthlySummary } from 'types';

@Table({
  schema: `services`,
  tableName: `documentation_monthly_summary`,
  timestamps: false,
})

export class DocumentationMonthlySummaryModel extends
  Model<IDocumentationMonthlySummary> implements IDocumentationMonthlySummary {
  @AllowNull(false)
  @PrimaryKey
  @Column
  public studentId: number;

  @AllowNull(false)
  @PrimaryKey
  @Column
  public therapistId: number;

  @AllowNull(false)
  @PrimaryKey
  @Column
  public year: number;

  @AllowNull(false)
  @PrimaryKey
  @Column
  public month: number;

  @AllowNull(true)
  @Column
  public totalDirectMinutes: number;
}

export default DocumentationMonthlySummaryModel;
