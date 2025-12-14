import { ITherapistSummary } from 'types';

export interface IGetTherapistsOptions {
  districtId?: number;
  endAt?: Date;
  serviceTypeGroupId?: number;
  startAt?: Date;
}

export interface ITherapistRepo {
  getSummary(query?: IGetTherapistsOptions): Promise<ITherapistSummary[]>;
}

export const ITherapistRepo = Symbol.for(`ITherapistRepo`);
