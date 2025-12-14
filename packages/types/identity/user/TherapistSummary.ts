import { UserDTO } from './User';

export type TherapistCaseLoad = `Overloaded` | `Full Case Load` | `Underassigned`;

export interface TherapistSummaryDTO extends Omit<UserDTO, `serviceTypes`> {
  caseLoadStatus?: TherapistCaseLoad;
  isExternalProvider: boolean;
  serviceTypes: string[];
  studentsAtDistrict: number;
  totalStudents: number;
}
