import { IStudent } from '../people';
import { IUser } from '../identity';

export interface IDocumentationMonthlySummary {
  month: number;
  student?: IStudent;
  studentId?: number;
  therapist?: IUser;
  therapistId: number;
  totalDirectMinutes: number;
  year: number;
}
