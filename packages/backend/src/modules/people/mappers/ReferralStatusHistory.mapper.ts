import { createSchema, morphism } from 'morphism';
import { ReferralStatusHistoryDTO } from 'rsd';
import { IReferralStatusHistory } from 'types';
import { UserMapper } from '../../user/mappers';
import ReferralStatusMapper from '../../reference/mappers/ReferralStatus.mapper';

export class ReferralStatusHistoryMapper {
  public static toDomain(data: ReferralStatusHistoryDTO): IReferralStatusHistory {
    const schema = createSchema<IReferralStatusHistory, ReferralStatusHistoryDTO>({
      id: `id`,
      createdAt: `createdAt`,
      createdBy: `createdBy`,
      referralId: `referralId`,
      statusId: `statusId`,
    });

    return morphism(schema, data);
  }

  public static toDTO(data: IReferralStatusHistory): ReferralStatusHistoryDTO {
    const schema = createSchema<ReferralStatusHistoryDTO, IReferralStatusHistory>({
      id: `id`,
      createdAt: `createdAt`,
      createdBy: `createdBy`,
      creator: ({ creator }) => creator ? UserMapper.toDTO(creator) : undefined,
      referralId: `referralId`,
      status: ({ status }) => status ? ReferralStatusMapper.toDTO(status) : undefined,
      statusId: `statusId`,
    });

    return morphism(schema, data);
  }
}

export default ReferralStatusHistoryMapper;
