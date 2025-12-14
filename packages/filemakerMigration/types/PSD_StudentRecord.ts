/* eslint-disable @typescript-eslint/naming-convention */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { DateOnlyString, Districts, PSD_Schools, PSD_therapist, TimeString } from '.';

/**
 * (ORIGINAL FILE: PSD_StudentRecord.fmp12)
 */
export interface PSD_StudentRecord {
  /** Date the student became active in Occupational Therapy */
  "active_date": DateOnlyString | null;

  /** Date the student became active in Physical Therapy */
  "active_date_PT": DateOnlyString | null;

  /**
   * Most recent school year the student was active in Occupational Therapy
   * (typically written as a year range since school years go between calendar years)
   */
  "active_year": string | null;

  /**
   * Most recent school year the student was active in Physical Therapy
   * (typically written as a year range since school years go between calendar years)
   */
  "active_year_PT": string | null;

  /**
   * Name of district that is billed for therapists' services
   * @see {@link Districts.district}
   */
  "Billing_District": string | null;

  /**
   * Name of the school building the student resides in
   * @see {@link PSD_Schools.Name}
   */
  "Building": string | null;

  /**
   * Name of district that the student's school building is in
   * @see {@link Districts.district}
   */
  "Building_District": string | null;

  /** UNSURE: EMPTY */
  "comment": never;

  /** Date that the student record was created in the system */
  "create_date": DateOnlyString | null;

  /** Time that the student record was created in the system */
  "create_time": TimeString | null;

  /** IRN for the district that the school is located in (district of attendance) */
  "d of a irn": string | null;

  /** IRN for the district that is billed for the therapist's services */
  "d of r irn": string | null;

  /** Original date the student was referred for therapy */
  "Date": DateOnlyString | null;

  /** UNSURE: EMPTY */
  "date1": never;

  /** UNSURE: EMPTY */
  "date2": never;

  /** UNSURE: EMPTY */
  "date3": never;

  // /** UNSURE: EMPTY */
  "date4": never;

  /** UNSURE */
  "date_check": 0 | 1 | null;

  /** UNSURE */
  "date_check_PT": 0 | 1 | null;

  /**
   * Name of district that the student lives in
   * @see {@link Districts.district}
   */
  "District of Residence": string | null;

  /** UNSURE: Mostly un-used, should it be removed? */
  "district_id": string | null;

  /** UNSURE: Name of representative from the district. Not sure what district this is for? */
  "District_Rep": string | null;

  /** Student's date of birth */
  "DOB": `?` | DateOnlyString | null; // eslint-disable-line @typescript-eslint/no-redundant-type-constituents

  /** UNSURE: EMPTY */
  "eval_pt": never;

  /** UNSURE: Possibly field 1 on a a document */
  "extra1": `1` | null;

  /** UNSURE: Possibly field 5d on a document */
  "extra5d": DateOnlyString | null;

  /** UNSURE: Possibly field 6n on a document */
  "extra6n": number | null;

  /** Supposed to be assistant Occupational Therapist's code, but includes other text in some rows */
  "extra_ot": string | null;

  /** Student Occupational Therapist's code */
  "extra_ot2": string | null;

  /** Additional Occupational Therapist's code */
  "extra_ot3": string | null;

  /** Supposed to be assistant Physical Therapist's code, but includes other text in some rows */
  "extra_pt": string | null;

  /** Student Physical Therapist's code */
  "extra_pt2": string | null;

  /** Additional Physical Therapist's code */
  "extra_pt3": string | null;

  /** UNSURE */
  "flag": `y` | null;

  /** First name of the student */
  "Fname": string | null;

  /** UNSURE */
  "handicap": string | null;

  /** ICD-9 Code, not used that much here, so likely move to just ServerData (Therapy sessions) */
  "icd9": string | null;

  /** The status of the student's IEP contract */
  "IEP_status": `Active` | `Discontinued` | null;

  /** If the student is currently active or inactive in Occupational Therapy */
  "inactive": string | null;

  /** What day did the student become inactive in Occupational Therapy */
  "inactive_date": DateOnlyString | null;

  /** What day did the student become inactive in Physical Therapy */
  "inactive_date_PT": DateOnlyString | null;

  /** If the student is currently active or inactive in Physical therapy */
  "inactive_PT": string | null;

  /** Last name of the student */
  "Lname": string | null;

  /** UNSURE */
  "med_referral_ot": `yes` | null;

  /** UNSURE: EMPTY */
  "med_referral_ot_back": never;

  /** UNSURE */
  "med_referral_ot_date": DateOnlyString | null;

  /** UNSURE */
  "med_referral_pt": `yes` | null;

  /** UNSURE: EMPTY */
  "med_referral_pt_back": never;

  /** UNSURE */
  "med_referral_pt_date": DateOnlyString | null;

  /** Middle initial of the student */
  "mi": string | null;

  /** If the student's Occupational Therapy should be counted in billing or not */
  "omit_ot": `omit from billing` | null;

  /** If the student's Physical Therapy should be counted in billing or not */
  "omit_pt": `omit from billing` | null;

  /** UNSURE */
  "onbase_new": DateOnlyString | null;

  /** UNSURE */
  "onbase_update": DateOnlyString | null;

  /** Day that the student started with Occupational Therapy */
  "OT_entry": DateOnlyString;

  /** UNSURE */
  "ot_pending_date": DateOnlyString;

  // eslint-disable-next-line @stylistic/max-len
  /** Therapist code of the occupational therapist that is temporarily covering for the other therapist(s) assigned to the student */
  "ot_temp_cover": string | null;

  /**
   * Name of the primary occupational therapist assigned to the student
   * @see {@link PSD_therapist.First_name} + " " + {@link PSD_therapist.Last_name}
   */
  "ot_therapist": string | null;

  /** UNSURE */
  "OT_withdrew": DateOnlyString | null;

  /** Code of the primary occupational therapist assigned to the student */
  "otcode": string | null;

  /** UNSURE: EMPTY */
  "pending_change": never;

  /** Phone number of the school the student goes to */
  "phone": string | null;

  /** UNSURE */
  "preschool": string | null;

  /** UNSURE */
  "preschool withdraw": DateOnlyString | null;

  /** UNSURE */
  "Prescription Date": DateOnlyString | null;

  /** Day that the student started with Physical Therapy */
  "PT_entry": DateOnlyString | null;

  /** UNSURE */
  "pt_pending_date": DateOnlyString | null;

  // eslint-disable-next-line @stylistic/max-len
  /** Therapist code of the physical therapist that is temporarily covering for the other therapist(s) assigned to the student */
  "pt_temp_cover": string | null;

  /**
   * Name of primary physical therapist assigned to the student
   * @see {@link PSD_therapist.First_name} + " " + {@link PSD_therapist.Last_name}
   */
  "pt_therapist": string | null;

  /** UNSURE */
  "PT_withdrew": DateOnlyString | null;

  /** Code of the primary physical therapist assigned to the student */
  "ptcode": string | null;

  /** UNSURE: Potentially student record unique identifier? */
  "Rec_ID": string;

  /** Name of the referring district */
  "Ref_district": string | null;

  /** UNSURE */
  "referral_type":
    `Evaluation` |
    `Forest Spec` |
    `IAT` |
    `Observation` |
    `Re-evaluation` |
    `Rosa Parks` |
    `RTI` |
    `Therapy Only` |
    `Transfer Referral` |
    null;

  /** Room number of the student's classroom */
  "Room_Number": string | null;

  /** Unique incrementing number auto generated but sometimes null */
  "serial": number | null;

  /** Unique incrementing number auto generated. Not null */
  "serial#": number;

  /** UNSURE */
  "service": string | null;

  /** UNSURE: Doesn't seem to be used */
  "SSN": string | null;

  /** Student's SSN (Should probably be removed) */
  "ssn2": string | null;

  /**
   * Student ids of the student. Has to be unique across all students,
   * Up to 9 can be stored. it is a number up to 5-6 characters in length.
   */
  "Student_IDs": number[] | null;

  /** Name of the student's teacher */
  "Teacher": string | null;

  /** UNSURE */
  "text1": string | null;

  /** UNSURE: EMPTY */
  "text2": never;

  /** UNSURE: EMPTY */
  "text3": never;

  /** UNSURE: EMPTY */
  "text4": never;

  /** UNSURE */
  "type2_ot": `eval` | `observe` | `RTI/IAT` | `scholar` | null;

  /** UNSURE */
  "type2_pt": `eval` | `observe` | `RTI/IAT` | `scholar` | null;

  /** UNSURE */
  "type_ot": string | null;

  /** UNSURE */
  "type_pt": string | null;
}
