/* eslint-disable @typescript-eslint/naming-convention */

/**
 * (ORIGINAL FILE: PSD_Schools.fmp12)
 */
export interface PSD_Schools {
  /** UNSURE: If the school is active? (Might not be used) */
  "Active": `Active` | null;

  /** Street address of the school building */
  "Address": string | null;

  /** Ohio IRN (Information Retrieval Number) number to identify the school building */
  "Build irn": string | null;

  /** City the school building is in */
  "City": string | null;

  /** County the school building is in */
  "County": string | null;

  /** District the school is in (Should be removed, and rely on the district IRN) */
  "District": string | null;

  /** Ohio IRN (Information Retrieval Number) number to identify the district the school is in */
  "District irn": string | null;

  /** Grades listed out: e.g. "K 1st 2nd 3rd" (Separated by newline) */
  "Grade_Range": string | null;

  /** Range of grades the school handles: (e.g. `K-5`, `6-12`, `P`) */
  "Grades": string | null;

  /** Name of the school */
  "Name": string | null;

  /** School contact phone number */
  "Phone": string | null;

  /** State the school building is in (typically in abbreviation form) */
  "State": string | null;

  /** Zip code of the school building */
  "Zip": string | null;
}
