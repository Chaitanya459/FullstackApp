import { IServiceType } from './ServiceType';

export interface IServiceTypeGroup {
  id: number;
  code: string;
  name: string;
  services?: IServiceType[];
}
