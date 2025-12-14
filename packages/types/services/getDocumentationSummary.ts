import { DocumentationSummaryRange } from './documentationSummary';

export interface GetDocumentationSummaryDTO {
  range: DocumentationSummaryRange;
  serviceTypeGroupCode: string;
}
