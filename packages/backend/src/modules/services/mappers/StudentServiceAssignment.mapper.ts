import { StudentServiceAssignmentDTO } from 'rsd';
import { IStudentServiceAssignment } from 'types';
import morphism, { createSchema } from 'morphism';
import { ServiceTypeMapper } from '../../reference/mappers';
import { StudentMapper } from '../../people/mappers';
import { UserMapper } from '../../user/mappers';

export class StudentServiceAssignmentMapper {
  public static toDomain(data: StudentServiceAssignmentDTO): IStudentServiceAssignment {
    const schema = createSchema<IStudentServiceAssignment, StudentServiceAssignmentDTO>({
      id: `id`,
      createdAt: `createdAt`,
      createdBy: `createdBy`,
      deletedAt: `deletedAt`,
      deletedBy: `deletedBy`,
      entryDate: `entryDate`,
      exitDate: `exitDate`,
      notes: `notes`,
      serviceTypeId: `serviceTypeId`,
      studentId: `studentId`,
      therapistId: `therapistId`,
      updatedAt: `updatedAt`,
      updatedBy: `updatedBy`,
    });

    return morphism(schema, data);
  }

  public static toDTO(data: IStudentServiceAssignment): StudentServiceAssignmentDTO {
    const schema = createSchema<StudentServiceAssignmentDTO, IStudentServiceAssignment>({
      id: `id`,
      createdAt: `createdAt`,
      createdBy: `createdBy`,
      deletedAt: `deletedAt`,
      deletedBy: `deletedBy`,
      entryDate: `entryDate`,
      exitDate: `exitDate`,
      notes: `notes`,
      serviceType: ({ serviceType }) => serviceType ? ServiceTypeMapper.toDTO(serviceType) : undefined,
      serviceTypeId: `serviceTypeId`,
      student: ({ student }) => student ? StudentMapper.toDTO(student) : undefined,
      studentId: `studentId`,
      therapist: ({ therapist }) => therapist ? UserMapper.toDTO(therapist) : undefined,
      therapistId: `therapistId`,
      updatedAt: `updatedAt`,
      updatedBy: `updatedBy`,
    });

    return morphism(schema, data);
  }
}
