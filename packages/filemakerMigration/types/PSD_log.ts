/* eslint-disable @typescript-eslint/naming-convention */
import { DateOnlyString, TimeString } from '.';

/**
 * (ORIGINAL FILE: PSD_log.fmp12)
 */
export interface PSD_log {
  /** Description on what action was performed, or if there was an error, description on what went wrong */
  action: string | null;

  /** Date of the event */
  date: DateOnlyString;

  /** UNSURE */
  number: number; // eslint-disable-line id-blacklist

  // eslint-disable-next-line @stylistic/max-len
  /** UNSURE: Looks to be the therapist code and a date and time of the event although the time is different from the time column */
  tdt: string;

  /** Therapist code that performed the action */
  therapist: string;

  /** Time of the event */
  time: TimeString;
}
