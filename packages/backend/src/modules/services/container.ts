import { container } from '../../infra/di/inversify.config';
import { DocumentationRepo } from './infra/repos/sequelizeDocumentationRepo';
import { IDocumentationRepo } from './app/repos';
import { GetNotesUseCase } from './app/getNotes/useCase';
import { GetNotesController } from './app/getNotes/controller';
import { SubmitNoteUseCase } from './app/submitNote/useCase';
import { SubmitNoteController } from './app/submitNote/controller';
import { UpsertNoteUseCase } from './app/upsertNote/useCase';
import { UpsertNoteController } from './app/upsertNote/controller';
import { GetNoteMinutesTotalUseCase } from './app/getNoteMinuteTotals/useCase';
import { GetNoteMinutesTotalController } from './app/getNoteMinuteTotals/controller';

// Repos
container.bind(IDocumentationRepo).to(DocumentationRepo);

// Services
//  NONE

// Use Cases
//  Note

container.bind(GetNotesUseCase).toSelf();
container.bind(GetNotesController).toSelf();

container.bind(SubmitNoteUseCase).toSelf();
container.bind(SubmitNoteController).toSelf();

container.bind(UpsertNoteUseCase).toSelf();
container.bind(UpsertNoteController).toSelf();

container.bind(GetNoteMinutesTotalUseCase).toSelf();
container.bind(GetNoteMinutesTotalController).toSelf();
