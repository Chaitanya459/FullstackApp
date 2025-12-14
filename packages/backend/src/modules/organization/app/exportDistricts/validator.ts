import { DistrictSummaryParamsDTO } from 'rsd';
import { z } from 'zod';

export const exportDistrictsBodySchema = z.object({
  districtIds: z.array(z.number().int().positive()).default([]),
  endDate: z.string().optional(),
  serviceTypeGroupId: z.coerce.number().int().positive().optional(),
  startDate: z.string().optional(),
}) satisfies z.ZodType<DistrictSummaryParamsDTO>;

export type IExportDistrictsInput = z.infer<typeof exportDistrictsBodySchema>;
