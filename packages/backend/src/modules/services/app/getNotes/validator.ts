import { GetDocumentationDTO } from 'rsd';
import { z } from 'zod';

export const getNotesSchema = z.object({
  districtId: z.coerce.number().optional(),
  serviceTypeGroupId: z.coerce.number().optional(),
  serviceTypeId: z.coerce.number().optional(),
  studentId: z.coerce.number().optional(),
  therapistId: z.coerce.number().optional(),
  yearId: z.coerce.number().optional(),
}) satisfies z.ZodType<GetDocumentationDTO>;
