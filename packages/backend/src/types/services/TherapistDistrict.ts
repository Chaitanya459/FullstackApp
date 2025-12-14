import { IAudited } from 'types/shared';
import { IDistrict } from '../organization';
import { IServiceType } from '../reference';
import { IUser } from '../identity';

export interface ITherapistDistrict extends IAudited {
  id: number;
  assignedDate: Date;
  createdAt: Date;
  district?: IDistrict;
  districtId: number;
  serviceType?: IServiceType;
  serviceTypeId: number;
  therapist?: IUser;
  therapistId: number;
  updatedAt: Date;
}
