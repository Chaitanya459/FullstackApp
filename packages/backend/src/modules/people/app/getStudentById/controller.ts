import { inject, injectable } from 'inversify';
import { Request } from 'express';
import morphism, { createSchema } from 'morphism';
import { GetStudentByIdDTO, StudentDTO } from 'rsd';
import { BaseController } from '../../../../infra/http/BaseController';
import { StudentMapper } from '../../mappers';
import { GetStudentByIdUseCase, IGetStudentByIdInput } from './useCase';
import { getStudentByIdParamsDTOSchema } from './validator';

@injectable()
export class GetStudentByIdController extends BaseController {
  public constructor(
    @inject(GetStudentByIdUseCase) private useCase: GetStudentByIdUseCase,
  ) {
    super();
  }

  private paramsMapper = createSchema<GetStudentByIdDTO, Omit<IGetStudentByIdInput, `studentId`>>({
    endDate: ({ endDate }) => endDate,
    serviceTypeGroupId: ({ serviceTypeGroupId }) =>
      serviceTypeGroupId !== undefined ? Number(serviceTypeGroupId) : undefined,
    startDate: ({ startDate }) => startDate,
    therapistId: ({ therapistId }) => therapistId,
  });

  public async executeImpl(req: Request): Promise<StudentDTO> {
    const rawParams = this.validateRequest(
      getStudentByIdParamsDTOSchema,
      req.query as unknown,
    );
    const mappedParams = morphism(this.paramsMapper, rawParams);

    const roleCodes = req.user.roleCodes || [];

    const isTherapist = roleCodes.includes(`THERAPIST`);

    // TODO: Decide how to handle admins who are also therapists

    const result = await this.useCase.execute({
      ...mappedParams,
      studentId: Number(req.params.id),
      ...(isTherapist ? { therapistId: req.user.id } : {}),
    });
    return StudentMapper.toDTO(result);
  }
}
