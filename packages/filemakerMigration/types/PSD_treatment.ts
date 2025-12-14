/* eslint-disable @typescript-eslint/naming-convention */
import { DateOnlyDataType } from 'sequelize';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Districts, PSD_Schools, PSD_StudentRecord } from '.';

/**
 * (ORIGINAL FILE: PSD_TreatmentServer.fmp12)
 */
export interface PSD_treatment {
  /** Status of the treatment */
  "active": `Active` | `Draft` | `Inactive` | null;

  /** Ideas of activities that the student can perform to help them reach their goals */
  "activity": string | null;

  /** Home address of the student */
  "address": string | null;

  /** Writeup on what changed in the amendment */
  "amend_change": string | null;

  /** Date an amendment was added to the treatment plan */
  "amend_date": DateOnlyDataType | string | null;

  /** The person who created the amendment */
  "amend_provider": string | null;

  /** Date the treatment plan was created */
  "create_date": DateOnlyDataType | null;

  /** Medical diagnosis given to the student */
  "diagnosis": string | null;

  /**
   * Name of the district the student lives in
   * @see {@link Districts.district}
  */
  "district": string | null;

  /** Student's date of birth */
  "dob": DateOnlyDataType | null;

  /** seems to be front-end flag */
  "download": `yes` | null;

  /**
   * UNSURE: EMPTY
   * Digital signature approving the treatment plan
   */
  "Electronic_sig": string | null;

  /**
   * UNSURE: EMPTY
   * Likely the parent of the student's email after referencing the PSD_Treatment file
   */
  "email": string | null;

  /** Plan of goals to accomplish */
  "goals": string | null;

  /** Grade level of the student */
  "grade": string | null;

  /**
   * UNSURE: Basically unused, only one row with data and it feels like test data
   * Not used in the treatment plan form either
   */
  "handicap": string | null;

  /** The date the IEP contract starts */
  "IEP date": DateOnlyDataType | null;

  /** Date that the ETR report was done (stands for Multi-Factored Evaluation) */
  "mfe": DateOnlyDataType | null;

  /** UNSURE: Basically unused, only one row with data (of the wrong type) and it feels like test data */
  "minutes": number | null;

  /** Name of the student's parent(s) */
  "parent": string | null;

  /** UNSURE: Mostly empty, a few records have data */
  "per": `4` | null;

  /** Phone number (likely of the parent) */
  "phone": string | null;

  /** Notes to keep in mind when a therapist works with the student that they should know beforehand */
  "precaution": string | null;

  /**
   * Supposed to be a unique identifier, but due to the nature of it getting
   * generated on the client-side, multiple client machines could generate the
   * same value when it gets uploaded to the server
   */
  "RecID": string | null;

  /** Room of the student's teacher */
  "room": string | null;

  /**
   * Name of the school the student is in
   * @see {@link PSD_Schools.Name} (Note: not officially linked)
   */
  "school": string | null;

  /** UNSURE: not much data and some data is district names */
  "school year": string | null;

  /**
   * UNSURE: not much data, appears to be phone numbers without area code, but
   * other data such as people's names and district names are here
   */
  "school#": string | null;
  "serial": number | null;
  /** UNSURE: EMPTY */
  "sessions": never;

  /** Appears to be an older version of the Electronic_sig column */
  "sign": string | null;

  /** Date that the treatment was signed off on (sign column) */
  "sign_date": DateOnlyDataType | null;

  /** The staff that will assist the student in this treatment */
  "staff": string | null;

  /** Full name of the student */
  "student": string | null;

  /**
   * @see {@link PSD_StudentRecord.Student_IDs}
   */
  "student_ID": string | null;

  /** Name of the student's teacher */
  "teacher": string | null;

  /** Name of the student's therapist */
  "therapist": string | null;

  /** Amount of time required in the IEP contract */
  "total time": string | null;
  "total time consult": string | null;
  "transfer": `X` | null;
  "transfer_date": string | null;
  "treatment": string | null;

  /** Date the treatment plan was created */
  "treatment_date": string | null;

  /** Supposed to be the type of therapy the student is receiving, but has extra data beyond "OT" and "PT" */
  "type": string | null;
}
