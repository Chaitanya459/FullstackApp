import { GenderDTO } from 'rsd';
import { IGender } from 'types';
import morphism, { createSchema } from 'morphism';

export class GenderMapper {
  public static toDomain(data: GenderDTO): IGender {
    const schema = createSchema<IGender, GenderDTO>({
      id: `id`,
      name: `name`,
    });

    return morphism(schema, data);
  }

  public static toDTO(data: IGender): GenderDTO {
    const schema = createSchema<GenderDTO, IGender>({
      id: `id`,
      name: `name`,
    });

    return morphism(schema, data);
  }
}
