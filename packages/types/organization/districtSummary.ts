import { ServiceTypeDTO } from '../reference';

export interface DistrictSummaryDTO {
  id: number;
  activeStudents: number;
  assignedTherapistCount: number;
  caseLoad?: number;
  fteProjected?: number;
  fteRequested?: number;
  fteUsed?: number;
  name: string;
  serviceTypeGroupIds: number[];
  serviceTypesByGroup: {
    [groupId: number]: ServiceTypeDTO[];
  };
  totalStudentServed?: number;
  ytdCost?: number;
}
