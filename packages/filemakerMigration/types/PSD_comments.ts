/* eslint-disable @typescript-eslint/naming-convention */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { DateOnlyString, PSD_StudentRecord, TimeString } from '.';

/**
 * (ORIGINAL FILE: PSD_comments.fmp12)
 */
export interface PSD_comments {
  /** Copied from PSD_StudentRecord upon creation */
  // "billing_district": string | null;

  /** Copied from PSD_StudentRecord upon creation */
  // "building": string | null;

  /**
   * Copied from PSD_StudentRecord upon creation
   * Name of the district the building is in
   */
  // "building_district": string | null;

  /** Comment about Student */
  "comments": string | null;

  /** Day the comment record was created */
  "create date": DateOnlyString;

  /** Time the comment record was created */
  "create time": TimeString;

  /** Defaults to the date the record was added, but can be modified */
  "date": DateOnlyString | null;
  "date given": DateOnlyString | null;
  "dist timeline": DateOnlyString | null;
  "month": string | null;
  "on_caseload": string | null;

  /** Day the parent signed off on the comment */
  "parent_sig": DateOnlyString | null;
  "pkt completed": DateOnlyString | null;
  "Pkt Rec'd": DateOnlyString | null;

  /**
   * @see {@link PSD_StudentRecord.Rec_ID}
   */
  "Rec_ID": string | null;

  /** The Rec_ID followed by ~OT or ~PT */
  "Rec_ID_type": string | null;
  "ref_code":
    `District Eval` |
    `EAT` |
    `ESY` |
    `IAT` |
    `Initial` |
    `OBS` |
    `oOBS` |
    `Reevaluation` |
    `RTI` |
    `Service Only` |
    `Starting Point` |
    `Transfer Ext.` |
    `Transfer Int.` |
    null;

  "referring__district": string | null;
  /** Appears to act as a unique id for the table */
  "serial": number;
  "status": `C` | `I` | `X` | null;

  /**
   * @see {@link PSD_StudentRecord.Student_IDs}
   */
  "student_number": string | null;

  /** UNSURE: EMPTY */
  // "student_numbers": never;

  /** UNSURE: Either therapist's name or code */
  "therapist": string | null;

  /** What type therapy is this comment for  */
  "type": `OT` | `PT`;
}
