import { IAudited } from 'types/shared';
import { IDistrict } from './District';

export interface IBuilding extends IAudited {
  id: number;
  createdAt: Date;
  district?: IDistrict;
  districtId: number;
  name: string;
  phoneNumber?: string;
  updatedAt: Date;
}
