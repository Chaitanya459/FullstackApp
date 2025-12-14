import { Request } from 'express';
import { DocumentationDTO } from 'rsd';
import { inject, injectable } from 'inversify';
import morphism, { createSchema } from 'morphism';
import { BaseController } from '../../../../infra/http/BaseController';
import { DocumentationMapper } from '../../mappers';
import { IUpsertNoteInput, UpsertNoteUseCase } from './useCase';
import { districtNoteSchema, studentNoteSchema } from './validator';

@injectable()
export class UpsertNoteController extends BaseController {
  public constructor(
    @inject(UpsertNoteUseCase) private readonly useCase: UpsertNoteUseCase,
  ) {
    super();
  }

  private paramsMapper = createSchema<IUpsertNoteInput, DocumentationDTO>({
    id: `id`,
    note: (dto) => DocumentationMapper.toDomain(dto),
  });

  public async executeImpl(req: Request) {
    const schema = req.query.mode === `student` ? studentNoteSchema : districtNoteSchema;
    this.validateRequest(schema, req.body);

    const dto = morphism(this.paramsMapper, req.body);

    const note = await this.useCase.execute(dto, req.user.id);

    return DocumentationMapper.toDTO(note);
  }
}
