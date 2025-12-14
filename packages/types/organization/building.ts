import { DistrictDTO } from './district';

export interface BuildingDTO {
  id: number;
  createdAt: Date;
  createdBy: number;
  deletedAt?: Date;
  deletedBy?: number | null;
  district?: DistrictDTO;
  districtId: number;
  name: string;
  phoneNumber?: string;
  updatedAt: Date;
  updatedBy: number;
}
