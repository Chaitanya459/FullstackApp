/* eslint-disable @typescript-eslint/naming-convention */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { DateOnlyString, PSD_StudentRecord, PSD_therapist } from '.';

/**
 * (ORIGINAL FILE: PSD_goals.fmp12)
 */
export interface PSD_goals {
  /**
   * Identifier for the goal, but it is not unique. To get a unique value, combine id and year
   */
  "id": string | null;

  /** UNSURE: EMPTY, Seems un-used as dates appear to be stored in the Progress_header table instead */
  "date": never;

  /** Goal text describing what the therapist is planning for the student to achieve */
  "goal": string | null;

  /** UNSURE: Appears to be either a goal type, or a way to organize goals into a hierarchy */
  "goal#": number | null;

  /** UNSURE: EMPTY */
  "goal_id": never;

  /** Date of the last time the goal was updated */
  "mod_date": DateOnlyString | null;

  /** Progress towards goal note 1 */
  "progress1": string | null;

  /** Progress towards goal note 2 */
  "progress2": string | null;

  /** Progress towards goal note 3 */
  "progress3": string | null;

  /** Progress towards goal note 4 */
  "progress4": string | null;

  /** Progress towards goal note 5 */
  "progress5": string | null;

  /** Progress towards goal note 6 */
  "progress6": string | null;

  /** Progress towards goal note 7 */
  "progress7": string | null;

  /** Progress towards goal note 8 */
  "progress8": string | null;

  /** UNSURE: Appears to be a runtime variable to select if you want to download the goal as pdf */
  "select": `select` | null;

  /**
   * Id of student the goal is for
   * @see {@link PSD_StudentRecord.Student_IDs}
   */
  "Student_ID": string | null;

  /**
   * UNSURE: Therapist code for therapist that created the goal
   * @see {@link PSD_therapist.code}
   */
  "therapist": string | null;

  /** UNSURE: If the goal was transferred between different therapists? */
  "transfer": `yes` | null;

  /**
   * UNSURE: Year the goal was planned for
   * Part of a composite primary key along with id
   */
  "year": string | null;
}
