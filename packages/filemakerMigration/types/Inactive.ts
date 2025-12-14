// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { DateOnlyString, Districts, PSD_StudentRecord } from '.';

/**
 * (ORIGINAL FILE: PSD_StudentRecord.fmp12)
 * Table defining history of when students become inactive
 */
export interface Inactive {
  /**
   * Name of district the student left activity from
   * @see {@link Districts.district}
   */
  "billing_district": string | null;

  /**
   * UNSURE
   * @see {@link PSD_StudentRecord}.serial#
   */
  "serial#": number;

  /**
   * Id of the student
   * @see {@link PSD_StudentRecord} (Most recent Student_IDs value)
   */
  "student_id": string;

  /** Therapy type the student is becoming inactive in */
  "type": `OT` | `PT`;

  /** The day that the student became inactive */
  "withdrew": DateOnlyString;
}
