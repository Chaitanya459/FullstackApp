import { IReferralStatus } from 'types';

export interface IGetReferralStatusOptions {
  code?: string;
}

export interface IReferralStatusRepo {
  get(options?: IGetReferralStatusOptions): Promise<IReferralStatus>;
}

export const IReferralStatusRepo = Symbol.for(`IReferralStatusRepo`);
