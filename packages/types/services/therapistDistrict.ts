import { DistrictDTO } from '../organization';
import { ServiceTypeDTO } from '../reference';
import { UserDTO } from '../identity';

export interface TherapistDistrictDTO {
  id: number;
  assignedDate: Date;
  createdAt: Date;
  createdBy: number;
  deletedAt?: Date;
  deletedBy?: number | null;
  district?: DistrictDTO;
  districtId: number;
  serviceType?: ServiceTypeDTO;
  serviceTypeId: number;
  therapist?: UserDTO;
  therapistId: number;
  updatedAt: Date;
  updatedBy: number;
}
