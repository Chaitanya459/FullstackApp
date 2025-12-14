import { GetDistrictTherapistInputDTO } from 'rsd';
import { z } from 'zod';

export const GetTherapistSchema = z.object({
  academicYearId: z.coerce.number().int().positive().optional(),
  districtId: z.coerce.number().int().positive().optional(),
  serviceTypeGroupId: z.coerce.number().min(0).optional(),
}) satisfies z.ZodType<GetDistrictTherapistInputDTO>;
