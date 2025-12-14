import { DocumentationDTO } from 'rsd';
import { z } from 'zod';

const baseNoteSchema = z.object({
  billingDistrictId: z.number().min(1, `billingDistrictId is required`),
  therapistId: z.number().min(1, `therapistId is required`),
}) satisfies z.ZodType<Partial<DocumentationDTO>>;

export const studentNoteSchema = baseNoteSchema.extend({
  serviceTypeId: z.number().min(1, `serviceTypeId is required for student notes`),
  studentId: z.number().min(1, `studentId is required for student notes`),
}) satisfies z.ZodType<Partial<DocumentationDTO>>;

export const districtNoteSchema = baseNoteSchema.extend({
  serviceTypeId: z.number().optional(),
  studentId: z.number().optional(),
}) satisfies z.ZodType<Partial<DocumentationDTO>>;
