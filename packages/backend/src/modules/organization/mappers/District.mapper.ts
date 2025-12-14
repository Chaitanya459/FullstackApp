import { DistrictDTO } from 'rsd';
import { IDistrict } from 'types';
import morphism, { createSchema } from 'morphism';

export class DistrictMapper {
  public static toDomain(data: DistrictDTO): IDistrict {
    const schema = createSchema<IDistrict, DistrictDTO>({
      id: `id`,
      createdAt: `createdAt`,
      createdBy: `createdBy`,
      deletedAt: `deletedAt`,
      deletedBy: `deletedBy`,
      escName: `escName`,
      name: `name`,
      updatedAt: `updatedAt`,
      updatedBy: `updatedBy`,
    });

    return morphism(schema, data);
  }

  public static toDTO(data: IDistrict): DistrictDTO {
    const schema = createSchema<DistrictDTO, IDistrict>({
      id: `id`,
      createdAt: `createdAt`,
      createdBy: `createdBy`,
      deletedAt: `deletedAt`,
      deletedBy: `deletedBy`,
      escName: `escName`,
      name: `name`,
      updatedAt: `updatedAt`,
      updatedBy: `updatedBy`,
    });

    return morphism(schema, data);
  }
}
