import { Request } from 'express';
import { inject, injectable } from 'inversify';
import morphism, { createSchema } from 'morphism';
import { DistrictSummaryDTO, DistrictSummaryParamsDTO } from 'rsd';
import { handleArrayParam } from '../../../../utils';
import { BaseController } from '../../../../infra/http/BaseController';
import { GetDistrictSummaryUseCase, IDistrictSummaryInput, IDistrictSummaryOutput } from './useCase';
import { districtSummaryParamsDTOSchema } from './validator';

@injectable()
export class GetDistrictSummaryController extends BaseController {
  public constructor(
    @inject(GetDistrictSummaryUseCase) private useCase: GetDistrictSummaryUseCase,
  ) {
    super();
  }

  private paramsMapper = createSchema<IDistrictSummaryInput, DistrictSummaryParamsDTO>({
    endDate: ({ endDate }) => endDate,
    ids: ({ districtIds }) => handleArrayParam(districtIds),
    serviceTypeGroupId: ({ serviceTypeGroupId }) =>
      serviceTypeGroupId !== undefined ? Number(serviceTypeGroupId) : undefined,
    startDate: ({ startDate }) => startDate,
  });

  private resultsMapper = createSchema<DistrictSummaryDTO, IDistrictSummaryOutput>({
    id: `id`,
    activeStudents: `activeStudents`,
    assignedTherapistCount: `assignedTherapistCount`,
    caseLoad: `caseLoad`,
    fteProjected: `fteProjected`,
    fteRequested: `fteRequested`,
    fteUsed: `fteUsed`,
    name: `name`,
    serviceTypeGroupIds: `serviceTypeGroupIds`,
    serviceTypesByGroup: `serviceTypesByGroup`,
    totalStudentServed: `totalStudentServed`,
    ytdCost: `ytdCost`,
  });

  public async executeImpl(req: Request): Promise<DistrictSummaryDTO[]> {
    const rawParams = this.validateRequest<DistrictSummaryParamsDTO>(
      districtSummaryParamsDTOSchema,
      req.query as unknown,
    );

    const params = morphism(this.paramsMapper, rawParams);

    const results = await this.useCase.execute(params);

    const response = results.map((result) => morphism(this.resultsMapper, result));

    return response;
  }
}
