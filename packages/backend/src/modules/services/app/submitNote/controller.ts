import { Request } from 'express';
import { inject, injectable } from 'inversify';
import { IDocumentation } from 'types';
import { DocumentationMapper } from '../../mappers';
import { BaseController } from '../../../../infra/http/BaseController';
import { SubmitNoteUseCase } from './useCase';

@injectable()
export class SubmitNoteController extends BaseController {
  public constructor(
    @inject(SubmitNoteUseCase) private readonly useCase: SubmitNoteUseCase,
  ) {
    super();
  }

  public async executeImpl(req: Request) {
    const { id } = req.params;
    const { submittedOn } = req.body as IDocumentation;

    const note = await this.useCase.execute({ id, submittedOn }, req.user.id);

    return DocumentationMapper.toDTO(note);
  }
}
