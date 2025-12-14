import { ActorId, IDocumentation, IDocumentationSummary } from 'types';

export interface IGetDocumentationInput {
  districtId?: number;
  endDate?: Date;
  serviceTypeGroupId?: number;
  serviceTypeId?: number;
  startDate?: Date;
  studentId?: number;
  therapistId?: number;
}

export interface IDocumentationRepo {
  get(input: IGetDocumentationInput): Promise<IDocumentation[]>;
  submit(note: IDocumentation, actorId: ActorId): Promise<IDocumentation>;
  upsert(note: Partial<IDocumentation>, actorId: ActorId): Promise<IDocumentation>;
  getById(id: string): Promise<IDocumentation | null>;
  getMinuteTotals(serviceTypeGroupCode: string, startDate: Date): Promise<IDocumentationSummary>;
}
export const IDocumentationRepo = Symbol.for(`IDocumentationRepo`);
