import { StudentDTO } from 'rsd';
import { IStudent } from 'types';
import morphism, { createSchema } from 'morphism';
import { DocumentationMapper, StudentEnrollmentMapper, StudentServiceAssignmentMapper } from '../../services/mappers';

export class StudentMapper {
  public static toDomain(data: StudentDTO): IStudent {
    const schema = createSchema<IStudent, StudentDTO>({
      id: `id`,
      county: `county`,
      createdAt: `createdAt`,
      createdBy: `createdBy`,
      dateOfBirth: `dateOfBirth`,
      deletedAt: `deletedAt`,
      deletedBy: `deletedBy`,
      firstName: `firstName`,
      lastName: `lastName`,
      updatedAt: `updatedAt`,
      updatedBy: `updatedBy`,
    });

    return morphism(schema, data);
  }

  public static toDTO(data: IStudent): StudentDTO {
    const schema = createSchema<StudentDTO, IStudent>({
      id: `id`,
      county: `county`,
      createdAt: `createdAt`,
      createdBy: `createdBy`,
      dateOfBirth: `dateOfBirth`,
      deletedAt: `deletedAt`,
      deletedBy: `deletedBy`,
      documentation: ({ documentation }) => documentation?.map(DocumentationMapper.toDTO),
      enrollments: ({ enrollments }) => enrollments?.map(StudentEnrollmentMapper.toDTO),
      firstName: `firstName`,
      lastName: `lastName`,
      serviceAssignments: ({ serviceAssignments }) => serviceAssignments?.map(StudentServiceAssignmentMapper.toDTO),
      updatedAt: `updatedAt`,
      updatedBy: `updatedBy`,
    });

    return morphism(schema, data);
  }
}
