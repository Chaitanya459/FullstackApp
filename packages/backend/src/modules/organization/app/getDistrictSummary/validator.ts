import { DistrictSummaryParamsDTO } from 'rsd';
import { z } from 'zod';

export const districtSummaryParamsDTOSchema = z.object({
  endDate: z.string().optional(),
  serviceTypeGroupId: z.coerce.number().int().positive().optional(),
  startDate: z.string().optional(),
}) satisfies z.ZodType<DistrictSummaryParamsDTO>;
