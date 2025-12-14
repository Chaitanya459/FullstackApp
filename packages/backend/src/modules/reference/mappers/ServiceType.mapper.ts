import { ServiceTypeDTO } from 'rsd';
import { IServiceType } from 'types';
import morphism, { createSchema } from 'morphism';
import { ServiceTypeGroupMapper } from './ServiceTypeGroup.mapper';

export class ServiceTypeMapper {
  public static toDomain(data: ServiceTypeDTO): IServiceType {
    const schema = createSchema<IServiceType, ServiceTypeDTO>({
      id: `id`,
      code: `code`,
      name: `name`,
      serviceTypeGroupId: `serviceTypeGroupId`,
    });

    return morphism(schema, data);
  }

  public static toDTO(data: IServiceType): ServiceTypeDTO {
    const schema = createSchema<ServiceTypeDTO, IServiceType>({
      id: `id`,
      code: `code`,
      name: `name`,
      serviceTypeGroup: ({ serviceTypeGroup }) => ServiceTypeGroupMapper.toDTO(serviceTypeGroup),
      serviceTypeGroupId: `serviceTypeGroupId`,
    });

    return morphism(schema, data);
  }
}
