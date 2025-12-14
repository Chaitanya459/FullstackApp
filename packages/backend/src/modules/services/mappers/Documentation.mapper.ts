import { DocumentationDTO } from 'rsd';
import { IDocumentation } from 'types';
import morphism, { createSchema } from 'morphism';
import { DistrictMapper } from '../../organization/mappers';
import { StudentMapper } from '../../people/mappers';
import { ServiceTypeMapper } from '../../reference/mappers';
import { UserMapper } from '../../user/mappers';

export class DocumentationMapper {
  public static toDomain(data: DocumentationDTO): IDocumentation {
    const schema = createSchema<IDocumentation, DocumentationDTO>({
      id: `id`,
      billingDistrict: ({ billingDistrict }) => billingDistrict ? DistrictMapper.toDomain(billingDistrict) : undefined,
      billingDistrictId: `billingDistrictId`,
      caseNotes: `caseNotes`,
      createdAt: `createdAt`,
      createdBy: `createdBy`,
      deletedAt: `deletedAt`,
      deletedBy: `deletedBy`,
      directMinutes: `directMinutes`,
      indirectMinutes: `indirectMinutes`,
      selectedGoals: `selectedGoals`,
      serviceDate: `serviceDate`,
      serviceTypeId: ({ serviceTypeId }) => serviceTypeId === -1 ? undefined : serviceTypeId,
      studentId: ({ studentId }) => studentId === -1 ? undefined : studentId,
      submittedOn: ({ submittedOn }) => submittedOn ? new Date(submittedOn) : null,
      therapistId: `therapistId`,
      travelMinutes: `travelMinutes`,
      updatedAt: `updatedAt`,
      updatedBy: `updatedBy`,
    });

    return morphism(schema, data);
  }

  public static toDTO(data: IDocumentation): DocumentationDTO {
    const schema = createSchema<DocumentationDTO, IDocumentation>({
      id: `id`,
      billingDistrict: ({ billingDistrict }) => billingDistrict ? DistrictMapper.toDTO(billingDistrict) : undefined,
      billingDistrictId: `billingDistrictId`,
      caseNotes: `caseNotes`,
      createdAt: `createdAt`,
      createdBy: `createdBy`,
      creator: ({ creator }) => creator ? UserMapper.toDTO(creator) : undefined,
      deletedAt: `deletedAt`,
      deletedBy: `deletedBy`,
      directMinutes: `directMinutes`,
      indirectMinutes: `indirectMinutes`,
      selectedGoals: `selectedGoals`,
      serviceDate: `serviceDate`,
      serviceType: ({ serviceType }) => serviceType ? ServiceTypeMapper.toDTO(serviceType) : undefined,
      serviceTypeId: `serviceTypeId`,
      student: ({ student }) => student ? StudentMapper.toDTO(student) : undefined,
      studentId: `studentId`,
      submittedOn: ({ submittedOn }) => submittedOn ? submittedOn.toISOString() : null,
      therapist: ({ therapist }) => therapist ? UserMapper.toDTO(therapist) : undefined,
      therapistId: `therapistId`,
      travelMinutes: `travelMinutes`,
      updatedAt: `updatedAt`,
      updatedBy: `updatedBy`,
    });

    return morphism(schema, data);
  }
}
