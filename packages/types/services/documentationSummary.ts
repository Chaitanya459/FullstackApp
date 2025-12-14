export interface DocumentationSummaryDTO {
  directMinutes: number;
  indirectMinutes: number;
  travelMinutes: number;
}

export type DocumentationSummaryRange = `month` | `3months` | `ytd`;

export interface DocumentationSummaryInputDTO {
  range: DocumentationSummaryRange;
  serviceTypeId: number;
}
