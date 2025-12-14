import { IDocumentationSummary, IUseCase } from 'types';
import { inject, injectable } from 'inversify';
import { DocumentationSummaryRange } from 'rsd';
import dayjs from 'dayjs';
import { IDocumentationRepo } from '../repos';

export interface IGetNotesSummaryInput {
  range: DocumentationSummaryRange;
  serviceTypeGroupCode: string;
}

@injectable()
export class GetNoteMinutesTotalUseCase implements IUseCase<IGetNotesSummaryInput, IDocumentationSummary> {
  public constructor(
    @inject(IDocumentationRepo) private readonly documentationRepo: IDocumentationRepo,
  ) { }

  private calculateStartDate(range: DocumentationSummaryRange) {
    let startDate: Date;
    if (range === `ytd`) {
      startDate = dayjs().subtract(1, `year`).toDate();
    } else if (range === `3months`) {
      startDate = dayjs().subtract(3, `months`).toDate();
    } else {
      startDate = dayjs().subtract(1, `month`).toDate();
    }
    return startDate;
  }

  public async execute({ range, serviceTypeGroupCode }: IGetNotesSummaryInput): Promise<IDocumentationSummary> {
    const startDate = this.calculateStartDate(range);
    const data = await this.documentationRepo.getMinuteTotals(serviceTypeGroupCode, startDate);
    return data;
  }
}
