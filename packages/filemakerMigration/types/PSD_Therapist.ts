/* eslint-disable @typescript-eslint/naming-convention */

/**
 * (ORIGINAL FILE: PSD_therapist.fmp12)
 */
export interface PSD_therapist {
  /** UNSURE: If therapist is active in the system (Able to log in)? */
  "active": `active` | null;

  // eslint-disable-next-line @stylistic/max-len
  /** Unique code to identify the therapist (Used by supervisors in the system to search and assign therapists to students) */
  "code": string;

  /** Therapist's first name */
  "First_name": string;

  /** Therapist's last name */
  "Last_name": string;

  // eslint-disable-next-line @stylistic/max-len
  /** Therapy type abbreviated followed by License number<br>E.G. `PT-1234`. The license number can be found when looking up a therapist through NPI search */
  "license": string | null;

  /** UNSURE: EMPTY */
  "note": never;

  /** NPI (National Provider Identifier) number that is associated with the therapist */
  "NPI": string | null;

  /** If the therapist performs Occupational or Physical therapy */
  "OtPt": `OT` | `PT` | null;

  /** UNSURE: Likely a field that when set to a value, changes the password of the therapist until they log in again */
  "Reset Password": string | null;

  /** Value that looks like a password that is used to determine what therapist uploaded data to the server */
  "signature": string | null;

  /** Title of the therapist */
  "title": `COTA` | `OTR/L` | `OTS` | `PT` | `PTA` | `PTS`;

  /** UNSURE: EMPTY */
  "title2": string | null;

  /** UNSURE: Likely the latest version of the system they logged into */
  "version": string | null;
}
