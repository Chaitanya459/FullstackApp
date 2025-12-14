import { ActorId, IDocumentation, IUseCase } from 'types';
import { inject, injectable } from 'inversify';
import { IDocumentationRepo } from '../repos';

export interface IUpsertNoteInput {
  id?: string;
  note: IDocumentation;
}

@injectable()
export class UpsertNoteUseCase implements IUseCase<IUpsertNoteInput, IDocumentation> {
  public constructor(
    @inject(IDocumentationRepo) private readonly documentationRepo: IDocumentationRepo,
  ) {}

  public async execute({ id, note }: IUpsertNoteInput, actorId: ActorId): Promise<IDocumentation> {
    const updatedNote = {
      ...note,
      id,
      createdAt: note.createdAt ?? new Date(),
      createdBy: note.createdBy ?? actorId,
      updatedAt: new Date(),
      updatedBy: actorId,
    };

    return await this.documentationRepo.upsert({ ...updatedNote, id }, actorId);
  }
}
