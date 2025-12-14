import { inject, injectable } from 'inversify';
import { Request } from 'express';
import morphism, { createSchema } from 'morphism';
import { GetDocumentationDTO } from 'rsd';
import { BaseController } from '../../../../infra/http/BaseController';
import { DocumentationMapper } from '../../mappers';
import { GetNotesUseCase, IGetNotesInput } from './useCase';
import { getNotesSchema } from './validator';

@injectable()
export class GetNotesController extends BaseController {
  public constructor(
    @inject(GetNotesUseCase) private useCase: GetNotesUseCase,
  ) {
    super();
  }

  private paramsMapper = createSchema<IGetNotesInput, GetDocumentationDTO>({
    districtId: `districtId`,
    serviceTypeGroupId: `serviceTypeGroupId`,
    serviceTypeId: `serviceTypeId`,
    studentId: `studentId`,
    therapistId: `therapistId`,
    yearId: `yearId`,
  });

  public async executeImpl(req: Request) {
    this.validateRequest(getNotesSchema, req.query);

    const dto = morphism(this.paramsMapper, req.query);

    const notes = await this.useCase.execute(dto);

    return notes?.map(DocumentationMapper.toDTO);
  }
}
