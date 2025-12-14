import { IDistrict } from 'types/organization';
import { IGender, IGradeLevel, IState } from 'types/reference';
import { IAudited } from 'types/shared';
import { IUser } from '../identity/User';
import { IReferralStatus } from '../reference/referralStatus';

export interface IReferral extends IAudited {
  id: number;
  billingDistrict?: IDistrict;
  billingDistrictId: number;
  buildingAttending: string;
  city: string;
  completedAt?: Date;
  districtOfResidence?: IDistrict;
  districtOfResidenceId: number;
  districtOfService?: IDistrict;
  districtOfServiceId: number;
  districtRepresentativeName: string;
  email: string;
  gender?: IGender;
  genderId: number;
  gradeLevel?: IGradeLevel;
  gradeLevelId: number;
  parentGuardianName: string;
  parentGuardianPhoneNumber: string;
  personRequestingService: string;
  phoneNumber: string;
  state?: IState;
  stateId: number;
  status?: IReferralStatus;
  statusAt: Date;
  statusBy: number;
  statusCreator?: IUser;
  statusId: number;
  studentDateOfBirth: Date;
  studentName: string;
  zipCode: string;
}
