import { ActorId } from '../shared';

export interface ILoginToken {
  id: ActorId;
  email: string;
  roleCodes: string[];
  roleIds: number[];
}
