import { BuildingDTO } from 'rsd';
import { IBuilding } from 'types';
import morphism, { createSchema } from 'morphism';
import { DistrictMapper } from './';

export class BuildingMapper {
  public static toDomain(data: BuildingDTO): IBuilding {
    const schema = createSchema<IBuilding, BuildingDTO>({
      id: `id`,
      createdAt: `createdAt`,
      createdBy: `createdBy`,
      deletedAt: `deletedAt`,
      deletedBy: `deletedBy`,
      districtId: `districtId`,
      name: `name`,
      phoneNumber: `phoneNumber`,
      updatedAt: `updatedAt`,
      updatedBy: `updatedBy`,
    });

    return morphism(schema, data);
  }

  public static toDTO(data: IBuilding): BuildingDTO {
    const schema = createSchema<BuildingDTO, IBuilding>({
      id: `id`,
      createdAt: `createdAt`,
      createdBy: `createdBy`,
      deletedAt: `deletedAt`,
      deletedBy: `deletedBy`,
      district: ({ district }) => district ? DistrictMapper.toDTO(district) : undefined,
      districtId: `districtId`,
      name: `name`,
      phoneNumber: `phoneNumber`,
      updatedAt: `updatedAt`,
      updatedBy: `updatedBy`,
    });

    return morphism(schema, data);
  }
}
