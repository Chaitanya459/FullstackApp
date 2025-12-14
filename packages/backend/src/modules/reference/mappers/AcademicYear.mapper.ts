import { AcademicYearDTO } from 'rsd';
import { IAcademicYear } from 'types';
import morphism, { createSchema } from 'morphism';

export class AcademicYearMapper {
  public static toDTO(data: IAcademicYear): AcademicYearDTO {
    const schema = createSchema<AcademicYearDTO, IAcademicYear>({
      id: `id`,
      endDate: `endDate`,
      name: `name`,
      startDate: `startDate`,
    });

    return morphism(schema, data);
  }

  public static toDomain(data: AcademicYearDTO): IAcademicYear {
    const schema = createSchema<IAcademicYear, AcademicYearDTO>({
      id: `id`,
      endDate: `endDate`,
      name: `name`,
      startDate: `startDate`,
    });

    return morphism(schema, data);
  }
}
