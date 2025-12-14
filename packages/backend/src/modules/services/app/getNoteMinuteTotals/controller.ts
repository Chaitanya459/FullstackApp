import { inject, injectable } from 'inversify';
import { Request } from 'express';
import morphism, { createSchema } from 'morphism';
import { DocumentationSummaryDTO, GetDocumentationSummaryDTO } from 'rsd';
import { IDocumentationSummary } from 'types';
import { BaseController } from '../../../../infra/http/BaseController';
import { GetNoteMinutesTotalUseCase, IGetNotesSummaryInput } from './useCase';

@injectable()
export class GetNoteMinutesTotalController extends BaseController {
  public constructor(
    @inject(GetNoteMinutesTotalUseCase) private useCase: GetNoteMinutesTotalUseCase,
  ) {
    super();
  }

  private paramsMapper = createSchema<IGetNotesSummaryInput, GetDocumentationSummaryDTO>({
    range: `range`,
    serviceTypeGroupCode: `serviceTypeGroupCode`,
  });

  private responseMapper = createSchema<IDocumentationSummary, DocumentationSummaryDTO>({
    directMinutes: ({ directMinutes }) => directMinutes ? Number(directMinutes) : 0,
    indirectMinutes: ({ indirectMinutes }) => indirectMinutes ? Number(indirectMinutes) : 0,
    travelMinutes: ({ travelMinutes }) => travelMinutes ? Number(travelMinutes) : 0,
  });

  public async executeImpl(req: Request) {
    const dto = morphism(this.paramsMapper, { ...req.params, ...req.query as unknown as GetDocumentationSummaryDTO });

    const summaryData = await this.useCase.execute(dto);

    return morphism(this.responseMapper, summaryData);
  }
}
