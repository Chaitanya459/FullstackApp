import { Request } from 'express';
import { GetStudentsDTO } from 'rsd';
import { inject, injectable } from 'inversify';
import morphism, { createSchema } from 'morphism';
import { BaseController } from '../../../../infra/http/BaseController';
import { StudentMapper } from '../../mappers/Student.mapper';
import { getStudentsSchema } from './validator';
import { GetStudentsUseCase, IGetStudentsInput } from './useCase';

@injectable()
export class GetStudentsController extends BaseController {
  public constructor(
    @inject(GetStudentsUseCase)
    private readonly useCase: GetStudentsUseCase,
  ) {
    super();
  }

  private paramsMapper = createSchema<IGetStudentsInput, GetStudentsDTO>({
    academicYearId: `academicYearId`,
    districtId: `districtId`,
    requireDocumentation: `requireDocumentation`,
    requireServiceAssignment: `requireServiceAssignment`,
    serviceTypeGroupId: `serviceTypeGroupId`,
    therapistId: `therapistId`,
  });

  public async executeImpl(req: Request) {
    const validatedQuery = this.validateRequest(getStudentsSchema, req.query);

    const roleCodes = Array.isArray(req.user?.roleCodes) ? req.user.roleCodes : [];
    const isTherapist = roleCodes.includes(`THERAPIST`);

    // TODO: Decide how to handle admins who are also therapists

    const dto: IGetStudentsInput = morphism(this.paramsMapper, {
      ...validatedQuery,
      ...(isTherapist ? { therapistId: req.user.id } : {}),
    });

    const students = await this.useCase.execute(dto);

    return students?.map(StudentMapper.toDTO) ?? [];
  }
}
