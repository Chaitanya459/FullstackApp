import { UserDTO } from '../identity';
import { ReferralStatusDTO } from '../reference/referralStatus';

export interface ReferralDTO {
  id?: number;
  billingDistrictId: number;
  buildingAttending: string;
  city: string;
  completedAt?: Date;
  createdAt?: Date;
  districtOfResidenceId: number;
  districtOfServiceId: number;
  districtRepresentativeName: string;
  email: string;
  genderId: number;
  gradeLevelId: number;
  parentGuardianName: string;
  parentGuardianPhoneNumber: string;
  personRequestingService: string;
  phoneNumber: string;
  stateId: number;
  status?: ReferralStatusDTO;
  statusAt?: Date;
  statusBy?: number;
  statusCreator?: UserDTO;
  statusId?: number;
  studentDateOfBirth: Date;
  studentName: string;
  zipCode: string;
}
