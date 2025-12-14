// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { DateOnlyString, PSD_StudentRecord } from '.';

/**
 * (ORIGINAL FILE: PSD_goals.fmp12)
 */
export interface Summary {
  /** Areas of focus, such as motor skills or visual ability */
  areas: string | null;
  building: string | null;
  date: DateOnlyString | null;
  district: string | null;

  /** Name of who signed the summary prefixed with "Electronically signed [by]" */
  electronic_sig: string | null;
  etr_date: DateOnlyString | null;
  iep_date: DateOnlyString | null;
  lock: `Locked` | null;

  /** Methods used to evaluate the student's performance separated by ";" */
  methods: string | null;
  /**
   * Refers to a goal
   * @see {@link PSD_goals.id}
   */
  rec_id: string | null;
  select: string | null;

  /** Date the summary was signed */
  sig_date: DateOnlyString | null;

  /**
   * @see {@link PSD_StudentRecord.Student_IDs}
   */
  student_id: string | null;

  /** Summary notes */
  summary: string | null;
  transfer: DateOnlyString | null;
  type: string | null;
  year: string | null;
}
