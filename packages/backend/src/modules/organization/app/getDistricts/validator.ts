import { z } from 'zod';

const academicYearSchema = z
  .string()
  .regex(/^\d{4}-\d{4}$/, `Year must be like 2025-2026`)
  .refine((v) => {
    const [ a, b ] = v.split(`-`).map(Number);
    return Number.isFinite(a) && Number.isFinite(b) && b === a + 1;
  }, `Years must be consecutive`);

export const districtListQuerySchema = z.object({
  id: z.coerce.number().int().positive().optional(),
  year: academicYearSchema.optional(),
}).strip();

export type IDistrictListQueryInput = z.infer<typeof districtListQuerySchema>;
