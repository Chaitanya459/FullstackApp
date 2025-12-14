import { IStudent } from './Student';

export interface IStudentMonthlySummary extends IStudent {
  monthlySummary: IMonthlyMinutes[];
}

export interface IMonthlyMinutes {
  month: number;
  totalDirectMinutes: number;
}
