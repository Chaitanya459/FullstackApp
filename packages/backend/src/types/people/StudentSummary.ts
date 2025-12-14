import { IStudent } from './Student';

export interface IStudentSummary extends IStudent {
  directMinutes?: number;
  indirectMinutes?: number;
  lastDirectService?: Date;
  travelMinutes?: number;
}
