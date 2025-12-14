import { Request } from 'express';
import { inject, injectable } from 'inversify';
import dayjs from 'dayjs';
import morphism, { createSchema } from 'morphism';
import { DistrictSummaryParamsDTO } from 'rsd';
import { handleArrayParam } from '../../../../utils';
import { FileDownloadController, IFile } from '../../../../infra/http/FileDownloadController';
import { ExportDistrictsUseCase, IExportDistrictsInput } from './useCase';
import { exportDistrictsBodySchema } from './validator';

@injectable()
export class ExportDistrictsController extends FileDownloadController {
  public constructor(
    @inject(ExportDistrictsUseCase) private readonly useCase: ExportDistrictsUseCase,
  ) {
    super();
  }

  private paramsMapper = createSchema<IExportDistrictsInput, DistrictSummaryParamsDTO>({
    endDate: `endDate`,
    ids: ({ districtIds }) => handleArrayParam(districtIds),
    serviceTypeGroupId: ({ serviceTypeGroupId }) =>
      serviceTypeGroupId !== undefined ? Number(serviceTypeGroupId) : undefined,
    startDate: `startDate`,
  });

  protected async executeImpl(req: Request): Promise<IFile> {
    const rawBody = this.validateRequest<DistrictSummaryParamsDTO>(
      exportDistrictsBodySchema,
      req.body,
    );

    const input = morphism(this.paramsMapper, rawBody);

    const csvContent = await this.useCase.execute(input);

    const date = dayjs().format(`YYYY-MM-DD`);
    const fileName = `districts-export-${date}.csv`;

    const file: IFile = {
      content: Buffer.from(csvContent, `utf-8`),
      mimetype: `text/csv`,
      name: fileName,
    };

    return file;
  }
}
