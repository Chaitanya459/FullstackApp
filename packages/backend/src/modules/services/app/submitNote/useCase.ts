import { ActorId, IDocumentation, IUseCase } from 'types';
import { inject, injectable } from 'inversify';
import { IDocumentationRepo } from '../repos';

export interface ISubmitNoteInput {
  id: string;
  submittedOn: Date;
}

@injectable()
export class SubmitNoteUseCase implements IUseCase<ISubmitNoteInput, IDocumentation> {
  public constructor(
    @inject(IDocumentationRepo) private readonly documentationRepo: IDocumentationRepo,
  ) {}

  public async execute({ id, submittedOn }: ISubmitNoteInput, actorId: ActorId): Promise<IDocumentation> {
    const existingNote = await this.documentationRepo.getById(id);

    if (!existingNote) {
      throw new Error(`Note not found`);
    }

    return this.documentationRepo.submit({ ...existingNote, submittedOn }, actorId);
  }
}
