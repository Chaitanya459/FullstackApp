import { GetStudentByIdDTO } from 'rsd';
import { z } from 'zod';

export const getStudentByIdParamsDTOSchema = z.object({
  endDate: z.string().optional(),
  serviceTypeGroupId: z.coerce.number().int().min(0).optional(),
  startDate: z.string().optional(),
  therapistId: z.coerce.number().int().positive().optional(),
}) satisfies z.ZodType<GetStudentByIdDTO>;
