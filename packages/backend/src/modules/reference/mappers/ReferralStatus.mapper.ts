import { createSchema, morphism } from 'morphism';
import { ReferralStatusDTO } from 'rsd';
import { IReferralStatus } from 'types';

export class ReferralStatusMapper {
  public static toDomain(data: ReferralStatusDTO): IReferralStatus {
    const schema = createSchema<IReferralStatus, ReferralStatusDTO>({
      id: `id`,
      code: `code`,
      name: `name`,
      sortOrder: `sortOrder`,
    });

    return morphism(schema, data);
  }

  public static toDTO(data: IReferralStatus): ReferralStatusDTO {
    const schema = createSchema<ReferralStatusDTO, IReferralStatus>({
      id: `id`,
      code: `code`,
      name: `name`,
      sortOrder: `sortOrder`,
    });

    return morphism(schema, data);
  }
}

export default ReferralStatusMapper;
