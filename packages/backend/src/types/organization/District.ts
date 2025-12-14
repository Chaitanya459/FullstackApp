import { IDocumentation, IStudentEnrollment, ITherapistDistrict } from 'types/services';
import { IAudited } from 'types/shared';
import { IBuilding } from './Building';

export interface IDistrict extends IAudited {
  id: number;
  attendanceEnrollments?: IStudentEnrollment[];
  billingEnrollments?: IStudentEnrollment[];
  buildings?: IBuilding[];
  documentation?: IDocumentation[];
  escName?: string;
  name: string;
  residenceEnrollments?: IStudentEnrollment[];
  therapistDistricts?: ITherapistDistrict[];
}
