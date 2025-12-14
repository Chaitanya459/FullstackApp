import { TherapistDistrictDTO } from 'rsd';
import { ITherapistDistrict } from 'types';
import morphism, { createSchema } from 'morphism';
import { DistrictMapper } from '../../organization/mappers';
import { ServiceTypeMapper } from '../../reference/mappers';
import { UserMapper } from '../../user/mappers';

export class TherapistDistrictMapper {
  public static toDomain(data: TherapistDistrictDTO): ITherapistDistrict {
    const schema = createSchema<ITherapistDistrict, TherapistDistrictDTO>({
      id: `id`,
      assignedDate: `assignedDate`,
      createdAt: `createdAt`,
      createdBy: `createdBy`,
      deletedAt: `deletedAt`,
      deletedBy: `deletedBy`,
      districtId: `districtId`,
      serviceTypeId: `serviceTypeId`,
      therapistId: `therapistId`,
      updatedAt: `updatedAt`,
      updatedBy: `updatedBy`,
    });

    return morphism(schema, data);
  }

  public static toDTO(data: ITherapistDistrict): TherapistDistrictDTO {
    const schema = createSchema<TherapistDistrictDTO, ITherapistDistrict>({
      id: `id`,
      assignedDate: `assignedDate`,
      createdAt: `createdAt`,
      createdBy: `createdBy`,
      deletedAt: `deletedAt`,
      deletedBy: `deletedBy`,
      district: ({ district }) => district ? DistrictMapper.toDTO(district) : undefined,
      districtId: `districtId`,
      serviceType: ({ serviceType }) => serviceType ? ServiceTypeMapper.toDTO(serviceType) : undefined,
      serviceTypeId: `serviceTypeId`,
      therapist: ({ therapist }) => therapist ? UserMapper.toDTO(therapist) : undefined,
      therapistId: `therapistId`,
      updatedAt: `updatedAt`,
      updatedBy: `updatedBy`,
    });

    return morphism(schema, data);
  }
}
