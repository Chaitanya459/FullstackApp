import { GetStudentsDTO } from 'rsd';
import { z } from 'zod';

export const getStudentsSchema = z.object({
  academicYearId: z.coerce.number().int().positive().optional(),
  districtId: z.coerce.number().int().positive().optional(),
  requireDocumentation: z.boolean().optional(),
  requireServiceAssignment: z.boolean().optional(),
  serviceTypeGroupId: z.coerce.number().int().positive().optional(),
  therapistId: z.coerce.number().optional(),
}) satisfies z.ZodType<GetStudentsDTO>;
