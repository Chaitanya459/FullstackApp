/**
 * (ORIGINAL FILE: PSD_Schools.fmp12)
 */
export interface Districts {
  /**
   * District identifier made up of district first letter capitalized and incrementing 2 digit number
   * for example, Tri-County North: T03, Tri-Village; T04
   */
  code: string | null;

  /** County the district is in */
  county: string;

  /** Name of the district */
  district: string;

  /** Ohio IRN (Information Retrieval Number) number to identify the district */
  irn: string;
}
