import { ServiceTypeDTO } from '../reference';
import { DocumentationDTO, StudentEnrollmentDTO, StudentServiceAssignmentDTO } from '../services';

export interface StudentDTO {
  id: number;
  county?: string;
  createdAt: Date;
  createdBy: number;
  dateOfBirth?: Date;
  deletedAt?: Date;
  deletedBy?: number | null;
  documentation?: DocumentationDTO[];
  enrollments?: StudentEnrollmentDTO[];
  firstName: string;
  lastName: string;
  serviceAssignments?: StudentServiceAssignmentDTO[];
  serviceTypes?: ServiceTypeDTO[];
  updatedAt: Date;
  updatedBy: number;
}
