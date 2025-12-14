import { IAudited } from 'types/shared';
import { IDistrict } from '../organization';
import { IStudent } from '../people';
import { IServiceType } from '../reference';
import { IUser } from '../identity';

export interface IDocumentation extends IAudited {
  id: string;
  billingDistrict?: IDistrict;
  billingDistrictId: number;
  caseNotes?: string;
  createdAt: Date;
  directMinutes: number;
  indirectMinutes: number;
  selectedGoals?: string[];
  serviceDate?: Date;
  serviceType?: IServiceType;
  serviceTypeId?: number;
  student?: IStudent;
  studentId?: number;
  submittedOn?: Date;
  therapist?: IUser;
  therapistId: number;
  travelMinutes: number;
  updatedAt: Date;
}
