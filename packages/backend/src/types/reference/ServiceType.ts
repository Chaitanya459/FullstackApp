import { IServiceTypeGroup } from './ServiceTypeGroup';

export interface IServiceType {
  id: number;
  code: string;
  name: string;
  serviceTypeGroup?: IServiceTypeGroup;
  serviceTypeGroupId: number;
}
