import { IReferral, IReferralStatus, IUser } from '..';

export interface IReferralStatusHistory {
  id: number;
  createdAt: Date;
  createdBy: number;
  readonly creator?: IUser;
  referralId: number;
  referrals?: IReferral[];
  status?: IReferralStatus;
  statusId: number;
}
