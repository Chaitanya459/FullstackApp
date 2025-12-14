import express from 'express';
import { container } from '../../../../infra/di/inversify.config';
import { UpsertNoteController } from '../../app/upsertNote/controller';
import { SubmitNoteController } from '../../app/submitNote/controller';
import { GetNotesController } from '../../app/getNotes/controller';
import { GetNoteMinutesTotalController } from '../../app/getNoteMinuteTotals/controller';

export const documentationRouter = express.Router();

const getNotesController = container.get(GetNotesController);
documentationRouter.get(`/`, getNotesController.execute);

const submitNoteController = container.get(SubmitNoteController);
documentationRouter.put(`/:id/submit`, submitNoteController.execute);

const upsertNoteController = container.get(UpsertNoteController);
documentationRouter.post(`/`, upsertNoteController.execute);

const getNoteMinutesTotalController = container.get(GetNoteMinutesTotalController);
documentationRouter.get(`/summary/:serviceTypeGroupCode`, getNoteMinutesTotalController.execute);
