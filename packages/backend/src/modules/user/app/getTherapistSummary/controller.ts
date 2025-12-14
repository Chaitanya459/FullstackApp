import { Request } from 'express';
import { GetDistrictTherapistInputDTO, TherapistSummaryDTO } from 'rsd';
import { inject, injectable } from 'inversify';
import morphism, { createSchema } from 'morphism';
import { ITherapistSummary } from 'types';
import { BaseController } from '../../../../infra/http/BaseController';
import { GetTherapistSchema } from './validator';
import { GetTherapistSummaryUseCase, IGetTherapistInput } from './useCase';

@injectable()
export class GetTherapistSummaryController extends BaseController {
  public constructor(
    @inject(GetTherapistSummaryUseCase)
    private readonly useCase: GetTherapistSummaryUseCase,
  ) {
    super();
  }

  private paramsMapper = createSchema<IGetTherapistInput, GetDistrictTherapistInputDTO>({
    academicYearId: `academicYearId`,
    districtId: `districtId`,
    serviceTypeGroupId: `serviceTypeGroupId`,
  });

  private responseMapper = createSchema<TherapistSummaryDTO, ITherapistSummary>({
    id: `id`,
    caseLoadStatus: ({ caseLoadStatus }) => caseLoadStatus ?? `Underassigned`,
    createdAt: `createdAt`,
    createdBy: `createdBy`,
    deletedAt: `deletedAt`,
    deletedBy: `deletedBy`,
    deletor: `deletor`,
    email: `email`,
    firstName: `firstName`,
    isExternalProvider: `isExternalProvider`,
    lastName: `lastName`,
    lockedAt: `lockedAt`,
    loginAttempts: `loginAttempts`,
    name: `name`,
    serviceTypes: `serviceTypes`,
    studentsAtDistrict: ({ studentsAtDistrict }) => studentsAtDistrict ? Number(studentsAtDistrict) : 0,
    totalStudents: ({ totalStudents }) => totalStudents ? Number(totalStudents) : 0,
    updatedAt: `updatedAt`,
    updatedBy: `updatedBy`,
  });

  public async executeImpl(req: Request) {
    const validatedQuery = this.validateRequest(GetTherapistSchema, req.query);

    const dto = morphism(this.paramsMapper, validatedQuery);

    const therapists = await this.useCase.execute(dto);

    return therapists.map((t) => morphism(this.responseMapper, t));
  }
}
