import { IReferral } from 'types';
import morphism, { createSchema } from 'morphism';
import { ReferralDTO } from 'rsd';
import ReferralStatusMapper from '../../reference/mappers/ReferralStatus.mapper';

export class ReferralMapper {
  public static toDomain(data: ReferralDTO): IReferral {
    const schema = createSchema<IReferral, ReferralDTO>({
      id: `id`,
      billingDistrict: `billingDistrict`,
      billingDistrictId: `billingDistrictId`,
      buildingAttending: `buildingAttending`,
      city: `city`,
      completedAt: `completedAt`,
      createdAt: `createdAt`,
      createdBy: `createdBy`,
      districtOfResidence: `districtOfResidence`,
      districtOfResidenceId: `districtOfResidenceId`,
      districtOfService: `districtOfService`,
      districtOfServiceId: `districtOfServiceId`,
      districtRepresentativeName: `districtRepresentativeName`,
      email: `email`,
      gender: `gender`,
      genderId: `genderId`,
      gradeLevel: `gradeLevel`,
      gradeLevelId: `gradeLevelId`,
      parentGuardianName: `parentGuardianName`,
      parentGuardianPhoneNumber: `parentGuardianPhoneNumber`,
      personRequestingService: `personRequestingService`,
      phoneNumber: `phoneNumber`,
      state: `state`,
      stateId: `stateId`,
      status: ({ status }) => status ? ReferralStatusMapper.toDomain(status) : undefined,
      statusAt: `statusAt`,
      statusBy: `statusBy`,
      statusCreator: `statusCreator`,
      statusId: `statusId`,
      studentDateOfBirth: `studentDateOfBirth`,
      studentName: `studentName`,
      updatedAt: `updatedAt`,
      updatedBy: `updatedBy`,
      zipCode: `zipCode`,
    });

    return morphism(schema, data);
  }

  public static toDTO(data: IReferral): ReferralDTO {
    const schema = createSchema<ReferralDTO, IReferral>({
      id: `id`,
      billingDistrictId: `billingDistrictId`,
      buildingAttending: `buildingAttending`,
      city: `city`,
      completedAt: `completedAt`,
      createdAt: `createdAt`,
      districtOfResidenceId: `districtOfResidenceId`,
      districtOfServiceId: `districtOfServiceId`,
      districtRepresentativeName: `districtRepresentativeName`,
      email: `email`,
      genderId: `genderId`,
      gradeLevelId: `gradeLevelId`,
      parentGuardianName: `parentGuardianName`,
      parentGuardianPhoneNumber: `parentGuardianPhoneNumber`,
      personRequestingService: `personRequestingService`,
      phoneNumber: `phoneNumber`,
      stateId: `stateId`,
      status: ({ status }) => status ? ReferralStatusMapper.toDTO(status) : undefined,
      statusAt: `statusAt`,
      statusBy: `statusBy`,
      statusCreator: `statusCreator`,
      statusId: `statusId`,
      studentDateOfBirth: `studentDateOfBirth`,
      studentName: `studentName`,
      zipCode: `zipCode`,
    });

    return morphism(schema, data);
  }
}
