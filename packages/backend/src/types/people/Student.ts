import { IAudited } from 'types/shared';
import {
  IDocumentation,
  IDocumentationMonthlySummary,
  IStudentEnrollment,
  IStudentServiceAssignment,
} from 'types/services';

export interface IStudent extends IAudited {
  id: number;
  county?: string;
  createdAt: Date;
  dateOfBirth?: Date;
  documentation?: IDocumentation[];
  documentationMonthlySummary?: IDocumentationMonthlySummary[];
  enrollments?: IStudentEnrollment[];
  firstName: string;
  lastName: string;
  serviceAssignments?: IStudentServiceAssignment[];
  updatedAt: Date;
}
