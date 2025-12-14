import { StudentEnrollmentDTO } from 'rsd';
import { IStudentEnrollment } from 'types';
import morphism, { createSchema } from 'morphism';
import { BuildingMapper, DistrictMapper } from '../../organization/mappers';
import { StudentMapper } from '../../people/mappers';
import { GradeLevelMapper } from '../../reference/mappers';

export class StudentEnrollmentMapper {
  public static toDomain(data: StudentEnrollmentDTO): IStudentEnrollment {
    const schema = createSchema<IStudentEnrollment, StudentEnrollmentDTO>({
      id: `id`,
      academicYearId: `academicYearId`,
      billingDistrictId: `billingDistrictId`,
      buildingId: `buildingId`,
      createdAt: `createdAt`,
      createdBy: `createdBy`,
      deletedAt: `deletedAt`,
      deletedBy: `deletedBy`,
      districtOfAttendanceId: `districtOfAttendanceId`,
      districtOfResidenceId: `districtOfResidenceId`,
      enrollmentDate: `enrollmentDate`,
      exitDate: `exitDate`,
      gradeLevelId: `gradeLevelId`,
      roomNumber: `roomNumber`,
      studentId: `studentId`,
      teacherName: `teacherName`,
      updatedAt: `updatedAt`,
      updatedBy: `updatedBy`,
    });

    return morphism(schema, data);
  }

  public static toDTO(data: IStudentEnrollment): StudentEnrollmentDTO {
    const schema = createSchema<StudentEnrollmentDTO, IStudentEnrollment>({
      id: `id`,
      academicYearId: `academicYearId`,
      billingDistrict: ({ billingDistrict }) => billingDistrict ? DistrictMapper.toDTO(billingDistrict) : undefined,
      billingDistrictId: `billingDistrictId`,
      building: ({ building }) => building ? BuildingMapper.toDTO(building) : undefined,
      buildingId: `buildingId`,
      createdAt: `createdAt`,
      createdBy: `createdBy`,
      deletedAt: `deletedAt`,
      deletedBy: `deletedBy`,
      districtOfAttendance: ({ districtOfAttendance }) =>
        districtOfAttendance ? DistrictMapper.toDTO(districtOfAttendance) : undefined,
      districtOfAttendanceId: `districtOfAttendanceId`,
      districtOfResidence: ({ districtOfResidence }) =>
        districtOfResidence ? DistrictMapper.toDTO(districtOfResidence) : undefined,
      districtOfResidenceId: `districtOfResidenceId`,
      enrollmentDate: `enrollmentDate`,
      exitDate: `exitDate`,
      gradeLevel: ({ gradeLevel }) => gradeLevel ? GradeLevelMapper.toDTO(gradeLevel) : undefined,
      gradeLevelId: `gradeLevelId`,
      roomNumber: `roomNumber`,
      student: ({ student }) => student ? StudentMapper.toDTO(student) : undefined,
      studentId: `studentId`,
      teacherName: `teacherName`,
      updatedAt: `updatedAt`,
      updatedBy: `updatedBy`,
    });

    return morphism(schema, data);
  }
}
