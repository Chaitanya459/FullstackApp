import { IAudited } from 'types/shared';
import { IServiceType } from '../reference';
import { IStudent } from '../people';
import { IUser } from '../identity';

export interface IStudentServiceAssignment extends IAudited {
  id: number;
  academicYearId?: number;
  createdAt: Date;
  entryDate: Date;
  exitDate?: Date;
  notes?: string;
  serviceType?: IServiceType;
  serviceTypeId: number;
  student?: IStudent;
  studentId: number;
  therapist?: IUser;
  therapistId: number;
  updatedAt: Date;
}
