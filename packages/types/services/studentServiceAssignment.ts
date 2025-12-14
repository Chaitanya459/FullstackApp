import { ServiceTypeDTO } from '../reference';
import { StudentDTO } from '../people';
import { UserDTO } from '../identity';

export interface StudentServiceAssignmentDTO {
  id: number;
  academicYearId?: number;
  createdAt: Date;
  createdBy: number;
  deletedAt?: Date;
  deletedBy?: number | null;
  entryDate: Date;
  exitDate?: Date;
  notes?: string;
  serviceType?: ServiceTypeDTO;
  serviceTypeId: number;
  student?: StudentDTO;
  studentId: number;
  therapist?: UserDTO;
  therapistId: number;
  updatedAt: Date;
  updatedBy: number;
}
