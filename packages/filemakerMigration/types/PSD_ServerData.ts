/* eslint-disable @typescript-eslint/naming-convention */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { DateOnlyString, Districts, PSD_StudentRecord, PSD_therapist, TimeString } from '.';

/**
 * (ORIGINAL FILE: PSD_ServerData.fmp12)
 */
export interface PSD_ServerData {
  "approved": `Approved` | null;

  /** Date that the therapy session notes was approved */
  "approved_date": DateOnlyString | null;

  /** UNSURE: EMPTY */
  "Bill_in_District": never;

  /** Name of the district that should be billed for this therapy session */
  "billing_district": string | null;

  /** Beginning time of the therapy session */
  "btime": TimeString | null;

  /** Notes about what happened in the therapy session */
  "comments": string | null;

  /** UNSURE: If multiple therapists helped or multiple therapy types were performed */
  "cotreat": string | null;

  /** Date that the therapy session information was entered in the system */
  "create_date": DateOnlyString | null;

  /** Time that the therapy session was created in the system */
  "create_time": TimeString | null;

  /** UNSURE: EMPTY */
  "created": never;

  /** UNSURE: IRN of the district that referred the student */
  "D_of_R_IRN": string | null;

  /** Date that the actual therapy session was performed */
  "date": DateOnlyString | null;

  /** UNSURE: Mostly empty except for some older notes */
  "date catch": 1 | null;

  /** UNSURE: EMPTY */
  "date1": never;

  /** UNSURE: EMPTY */
  "date2": never;

  /**
   * UNSURE: District the student lives in
   * @see {@link Districts.district}
   */
  "District of residence": string | null;

  /** UNSURE */
  "dup": string | null;

  /** Ending time of the therapy session */
  "etime": TimeString | null;

  /** UNSURE: EMPTY */
  "exported": never;

  /** UNSURE: EMPTY */
  "extra 1d": never;

  /** UNSURE: EMPTY */
  "extra 1t": never;

  /** UNSURE: EMPTY */
  "extra 2t": never;

  /** UNSURE: EMPTY */
  "extra_d": never;

  /** UNSURE: EMPTY */
  "extra_n": never;

  /** UNSURE: EMPTY */
  "extra_t": never;

  /** UNSURE */
  "final adjusted minutes": number | null;

  /** How many students were present in the therapy session (used to divide out therapist time per student) */
  "Group": number | null;

  /** UNSURE: Type of handicap being addressed in the therapy session */
  "handicap": string | null;

  /** UNSURE: ICD_9 Code being addressed in the therapy session. Could also be ICD_10? */
  "icd_9": string | null;

  /** Location the therapy session took place */
  "location": string | null;

  /** CPT code describing what type of therapy was performed in the therapy session */
  "med_code": string | null;

  /** UNSURE */
  "med_referral_ot": string | null;

  /** UNSURE */
  "med_referral_pt": string | null;

  /** Length of time (in minutes) of the therapy session (should line up with the time between btime and etime) */
  "minutes": number | null;

  /** UNSURE: Date the record was updated */
  "mod_date": DateOnlyString;

  /** UNSURE: Time the record was updated */
  "mod_time": TimeString;

  /** Comment on what was changed when the therapy session record was updated */
  "note_comment": string | null;

  /** UNSURE: EMPTY */
  "number1": never;

  /** UNSURE: EMPTY */
  "number2": never;

  /** Objective of the therapy session */
  "Objective": string | null;

  /** Type of therapy (PT or OT) (should always be provided, but some records have it missing) */
  "OtPt": `OT` | `PT` | `PT.` | null;

  /** UNSURE */
  "otpt_id": number | null;

  // eslint-disable-next-line @stylistic/max-len
  /** Can probably remove, appears to be a custom error message that is fetched when you try to create a therapy session that overlaps with the time of this one */
  "overlap": string | null;

  /** UNSURE: EMPTY */
  "overlap number": never;

  /** UNSURE */
  "preschool": string | null;

  /** Unique identifier for the therapy session (should be provided, but some records don't have it) */
  "RecId": string | null;

  /** UNSURE: EMPTY */
  "RecordID": never;

  /** UNSURE */
  "Referral": `yes` | null;

  /** UNSURE: EMPTY */
  "serial_key": never;

  /** UNSURE */
  "serial_number": number | null;

  // eslint-disable-next-line @stylistic/max-len
  /** The type of service being provided or performed for the student (based on options in the PSD_Student file? Some extra data doesn't align with this) */
  "Service code": number | null;

  /** SSN of the student (should probably remove) (not on that many records) */
  "ssn": number | null;

  /** UNSURE */
  "status": string | null;

  /** Student's last name, first name (sometimes is districts not students?) */
  "Student": string | null;

  /**
   * Refers to one of the student's student ids
   * @see {@link PSD_StudentRecord.Student_IDs}
   */
  "Student_ID": string | null;

  /** UNSURE: EMPTY */
  "student_total_minutes": never;

  /** If the therapy session was done remotely  */
  "tele": string | null;

  /** UNSURE: EMPTY */
  "text1": never;

  /** UNSURE: EMPTY */
  "text2": never;

  /**
   * UNSURE: Therapist code for the therapist that performed the therapy session
   * @see {@link PSD_therapist.code}
   */
  "Therapist": string | null;

  /**
   * UNSURE: Therapist code of the supervisor therapist for the therapist that performed the therapy session
   * @see {@link PSD_therapist.code}
   */
  "therapist_supervisor": string | null;

  /** UNSURE: Appears to be a backup copy of the minutes column (probably remove) */
  "TTime Copy2": number | null;

  /** Type of student treatment contract that this therapy session is for */
  "type": string | null;

  /** Date that the record was added */
  "upload_date": DateOnlyString;
}
