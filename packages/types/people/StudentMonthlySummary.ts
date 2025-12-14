import { StudentDTO } from './student';

export interface MonthlyMinutesDTO {
  month: number;
  totalDirectMinutes: number;
}

export interface StudentMonthlySummaryDTO extends StudentDTO {
  monthlySummary: MonthlyMinutesDTO[];
}
