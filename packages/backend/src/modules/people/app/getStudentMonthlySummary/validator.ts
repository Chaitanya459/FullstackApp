import { GetStudentMonthlySummaryDTO } from 'rsd';
import { z } from 'zod';

export const getStudentsMonthlySummarySchema = z.object({
  yearId: z.string(),
}) satisfies z.ZodType<GetStudentMonthlySummaryDTO>;
