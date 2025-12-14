import { inject, injectable } from 'inversify';
import { Request } from 'express';
import morphism, { createSchema } from 'morphism';
import { GetStudentSummaryDTO, StudentSummaryDTO } from 'rsd';
import { IStudentSummary } from 'types';
import { BaseController } from '../../../../infra/http/BaseController';
import { StudentEnrollmentMapper, StudentServiceAssignmentMapper } from '../../../services/mappers';
import { GetStudentSummaryUseCase, IGetStudentSummaryInput } from './useCase';
import { getStudentsByTherapistSchema } from './validator';

@injectable()
export class GetStudentSummaryController extends BaseController {
  public constructor(
    @inject(GetStudentSummaryUseCase) private useCase: GetStudentSummaryUseCase,
  ) {
    super();
  }

  private paramsMapper = createSchema<IGetStudentSummaryInput, GetStudentSummaryDTO>({
    therapistId: `therapistId`,
    yearId: `yearId`,
  });

  private responseMapper = createSchema<StudentSummaryDTO, IStudentSummary>({
    id: `id`,
    county: `county`,
    createdAt: `createdAt`,
    createdBy: `createdBy`,
    dateOfBirth: `dateOfBirth`,
    deletedAt: `deletedAt`,
    deletedBy: `deletedBy`,
    directMinutes: `directMinutes`,
    enrollments: ({ enrollments }) => enrollments?.map(StudentEnrollmentMapper.toDTO),
    firstName: `firstName`,
    indirectMinutes: `indirectMinutes`,
    lastDirectService: `lastDirectService`,
    lastName: `lastName`,
    serviceAssignments: ({ serviceAssignments }) => serviceAssignments?.map(StudentServiceAssignmentMapper.toDTO),
    travelMinutes: `travelMinutes`,
    updatedAt: `updatedAt`,
    updatedBy: `updatedBy`,
  });

  public async executeImpl(req: Request) {
    const validatedQuery = this.validateRequest(getStudentsByTherapistSchema, req.query);

    const therapistId = validatedQuery.therapistId ?? req.user?.id;

    const dto = morphism(this.paramsMapper, {
      ...validatedQuery,
      therapistId,
    });

    const students = await this.useCase.execute(dto);

    return morphism(this.responseMapper, students);
  }
}
