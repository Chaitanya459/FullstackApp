import { StudentDTO } from './student';

export interface StudentSummaryDTO extends StudentDTO {
  directMinutes: number;
  indirectMinutes: number;
  lastDirectService: string | null;
  travelMinutes: number;
}
