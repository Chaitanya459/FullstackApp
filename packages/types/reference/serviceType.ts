import { ServiceTypeGroupDTO } from './serviceTypeGroup';

export interface ServiceTypeDTO {
  id: number;
  code: string;
  name: string;
  serviceTypeGroup?: ServiceTypeGroupDTO;
  serviceTypeGroupId: number;
}
