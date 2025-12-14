import { DistrictDTO } from '../organization';
import { StudentDTO } from '../people';
import { ServiceTypeDTO } from '../reference';
import { UserDTO } from '../identity';

export type NoteType = `student` | `district`;

export interface DocumentationDTO {
  id: string;
  billingDistrict?: DistrictDTO;
  billingDistrictId: number;
  caseNotes?: string;
  createdAt: Date;
  createdBy: number;
  creator?: UserDTO;
  deletedAt?: Date;
  deletedBy?: number | null;
  directMinutes: number;
  indirectMinutes: number;
  noteType?: NoteType;
  selectedGoals?: string[];
  serviceDate?: Date;
  serviceType?: ServiceTypeDTO;
  serviceTypeId?: number;
  student?: StudentDTO;
  studentId?: number;
  submittedOn: string | null;
  therapist?: UserDTO;
  therapistId: number;
  travelMinutes: number;
  updatedAt: Date;
  updatedBy: number;
}
