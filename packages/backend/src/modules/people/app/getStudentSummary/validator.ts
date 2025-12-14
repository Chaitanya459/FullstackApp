import { GetStudentSummaryDTO } from 'rsd';
import { z } from 'zod';

export const getStudentsByTherapistSchema = z.object({
  therapistId: z.coerce.number().optional(),
  yearId: z.string(),
}) satisfies z.ZodType<GetStudentSummaryDTO>;
