import { IDistrict } from 'types';

export interface IGetDistrictFilter {
  endDate?: string;
  ids?: number[];
  serviceTypeGroupId?: number;
  startDate?: string;
}

export interface IDistrictRepo {
  get(input?: IGetDistrictFilter): Promise<IDistrict[]>;
}

export const IDistrictRepo = Symbol.for(`IDistrictRepo`);
