import { TherapistCaseLoad } from 'rsd';
import { IUser } from './User';

export interface ITherapistSummary extends Omit<IUser, `serviceTypes`> {
  caseLoadStatus?: TherapistCaseLoad;
  isExternalProvider: boolean;
  serviceTypes: string[];
  studentsAtDistrict: number;
  totalStudents: number;
}
