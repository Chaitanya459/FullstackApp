/* eslint-disable @typescript-eslint/naming-convention */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { DateOnlyString, PSD_goals, PSD_StudentRecord } from '.';

/**
 * (ORIGINAL FILE: PSD_goals.fmp12)
 * Table that contains additional information for goals
 */
export interface Progress_header {
  /**
   * Goal id this record relates to
   * @see {@link PSD_goals.id} Combination of goal id and year to link this data
   * @see {@link PSD_goals.year}
   */
  id: string | null;

  /** Array of up to 8 dates that map to each progress note from a goal */
  date: DateOnlyString[] | null;

  /**
   * Id of the goal's student (probably remove as this should be pulled from the goal record)
   * @see {@link PSD_StudentRecord.Student_IDs}
   */
  student_id: string | null;

  /**
   * UNSURE: This might be the year that the goal was started
   * Should match with goals to properly reference it
   */
  year: string | null;
}
