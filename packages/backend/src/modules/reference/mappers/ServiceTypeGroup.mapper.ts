import { ServiceTypeGroupDTO } from 'rsd';
import { IServiceTypeGroup } from 'types';
import morphism, { createSchema } from 'morphism';

export class ServiceTypeGroupMapper {
  public static toDomain(data: ServiceTypeGroupDTO): IServiceTypeGroup {
    const schema = createSchema<IServiceTypeGroup, ServiceTypeGroupDTO>({
      id: `id`,
      code: `code`,
      name: `name`,
    });

    return morphism(schema, data);
  }

  public static toDTO(data: IServiceTypeGroup): ServiceTypeGroupDTO {
    const schema = createSchema<ServiceTypeGroupDTO, IServiceTypeGroup>({
      id: `id`,
      code: `code`,
      name: `name`,
    });

    return morphism(schema, data);
  }
}
