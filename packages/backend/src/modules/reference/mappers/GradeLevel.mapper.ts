import { GradeLevelDTO } from 'rsd';
import { IGradeLevel } from 'types';
import morphism, { createSchema } from 'morphism';

export class GradeLevelMapper {
  public static toDomain(data: GradeLevelDTO): IGradeLevel {
    const schema = createSchema<IGradeLevel, GradeLevelDTO>({
      id: `id`,
      code: `code`,
      createdAt: `createdAt`,
      name: `name`,
      order: `order`,
      updatedAt: `updatedAt`,
    });

    return morphism(schema, data);
  }

  public static toDTO(data: IGradeLevel): GradeLevelDTO {
    const schema = createSchema<GradeLevelDTO, IGradeLevel>({
      id: `id`,
      code: `code`,
      createdAt: `createdAt`,
      name: `name`,
      order: `order`,
      updatedAt: `updatedAt`,
    });

    return morphism(schema, data);
  }
}
