import { inject, injectable } from 'inversify';
import { Request } from 'express';
import morphism, { createSchema } from 'morphism';
import { GetStudentMonthlySummaryDTO, StudentMonthlySummaryDTO } from 'rsd';
import { IStudentMonthlySummary } from 'types';
import { BaseController } from '../../../../infra/http/BaseController';
import { StudentEnrollmentMapper, StudentServiceAssignmentMapper } from '../../../services/mappers';
import { GetStudentMonthlySummaryUseCase, IGetMonthlySummaryInput } from './useCase';
import { getStudentsMonthlySummarySchema } from './validator';

@injectable()
export class GetStudentMonthlySummaryController extends BaseController {
  public constructor(
    @inject(GetStudentMonthlySummaryUseCase) private useCase: GetStudentMonthlySummaryUseCase,
  ) {
    super();
  }

  private paramsMapper = createSchema<IGetMonthlySummaryInput, GetStudentMonthlySummaryDTO>({
    therapistId: `therapistId`,
    yearId: `yearId`,
  });

  private responseMapper = createSchema<StudentMonthlySummaryDTO, IStudentMonthlySummary>({
    id: `id`,
    county: `county`,
    createdAt: `createdAt`,
    createdBy: `createdBy`,
    dateOfBirth: `dateOfBirth`,
    deletedAt: `deletedAt`,
    deletedBy: `deletedBy`,
    enrollments: ({ enrollments }) => enrollments?.map(StudentEnrollmentMapper.toDTO),
    firstName: `firstName`,
    lastName: `lastName`,
    monthlySummary: ({ monthlySummary }) => monthlySummary || [],
    serviceAssignments: ({ serviceAssignments }) => serviceAssignments?.map(StudentServiceAssignmentMapper.toDTO),
    updatedAt: `updatedAt`,
    updatedBy: `updatedBy`,
  });

  public async executeImpl(req: Request) {
    const therapistId = req.user?.id;

    const validatedQuery = this.validateRequest(getStudentsMonthlySummarySchema, req.query);
    const dto = morphism(this.paramsMapper, { ...validatedQuery, therapistId });

    const students = await this.useCase.execute(dto);

    return morphism(this.responseMapper, students);
  }
}
