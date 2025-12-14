/* eslint-disable @typescript-eslint/naming-convention */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { DateOnlyString, Districts, PSD_StudentRecord, PSD_therapist } from '.';

/**
 * Contains information for an Evaluation Team Report (ETR) which
 * appears to determine eligibility for services such as an IEP
 * (ORIGINAL FILE: PSD_goals.fmp12)
 */
export interface reports {
  /** Age of the student (can include month) */
  "age": string | null;

  /** Areas that are planned to be worked on such as motor skills or sensory abilities separated by a ", " */
  "areas": string | null;

  /** Date the ETR report was created */
  "create date": DateOnlyString | null;

  /** Dates that the evaluation was performed */
  "dates_of_evaluations": string | null;
  "district_id": string | null;

  /** Student's date of birth */
  "dob": DateOnlyString | null;

  /** Name of the person that evaluated the student and created the ETR report */
  "evaluator": string | null;

  /**
   * Name of the student's district of residence
   * @see {@link Districts.district} (Not official connection)
   */
  "extra1": string | null;

  /** Labeled in the UI as "Discipline" */
  "extra2": string | null;

  /** Location that the student was evaluated */
  "extra3": string | null;

  /** UNSURE: EMPTY */
  "extra4": never;

  /** Gender of the student */
  "gender": string | null;

  /** Grade level of the student */
  "grade": string | null;

  /** Summary of the ETR results and next steps */
  "implications": string | null;

  /** Last name of the student being evaluated in the ETR report */
  "last_name": string | null;
  "lock": `Lock` | null;
  "log": string | null;

  /** Methods used to evaluate the student's performance separated by ";" */
  "method": string | null;

  /** For methods that do not exist in the method list, this is a free-form text field to enter a custom method */
  "method_other": string | null;

  /** First name of the student being evaluated in the ETR report */
  "name": string | null;

  /** Background information related to why a student is getting assessed for eligibility */
  "narrative": string | null;

  /** Description of things that the student needs to be successful in school */
  "needs": string | null;

  /** Nickname of the student */
  "nick": string | null;

  /** Notes related to the ETR report */
  "notes": string | null;
  "position": string | null;

  /** UUID for the ETR report */
  "Rec_ID": string | null;

  /** Auto generated value that should be unique but isn't */
  "serial": number | null;

  /** Name of the primary evaluator */
  "signature": string | null;

  /**
   * If the printed report should include a secondary signature line for the secondary evaluator
   * This is required if the first signature was signed electronically
   */
  "signature2": `Priint second ` | `Print Second` | null;

  /** Name of secondary evaluator */
  "signature3": string | null;

  /**
   * @see {@link PSD_StudentRecord.Student_IDs}
   */
  "student number": string | null;

  /**
   * Student therapist code
   * @see {@link PSD_therapist.code}
   */
  "student_code": string | null;
  "student_ids": string | null;
  "teacher": string | null;
  "therapist": string | null;

  /**
   * @see {@link PSD_therapist.code}
   */
  "therapist_code": string | null;

  /** Title/position of the evaluator */
  "title": string | null;
  "type": string | null;
}
