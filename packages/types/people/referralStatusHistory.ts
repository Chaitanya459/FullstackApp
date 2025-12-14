import { UserDTO } from '../identity';
import { ReferralStatusDTO } from '../reference/referralStatus';

export interface ReferralStatusHistoryDTO {
  id: number;
  createdAt: Date;
  createdBy: number;
  readonly creator?: UserDTO;
  referralId: number;
  status?: ReferralStatusDTO;
  statusId: number;
}
