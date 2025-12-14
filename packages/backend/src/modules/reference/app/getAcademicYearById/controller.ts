import { inject, injectable } from 'inversify';
import { Request } from 'express';
import { BaseController } from '../../../../infra/http/BaseController';
import { AcademicYearMapper } from '../../mappers';
import { GetAcademicYearByIdUseCase } from './useCase';

@injectable()
export class GetAcademicYearByIdController extends BaseController {
  public constructor(
    @inject(GetAcademicYearByIdUseCase)
    private readonly useCase: GetAcademicYearByIdUseCase,
  ) {
    super();
  }

  public async executeImpl(req: Request) {
    const data = await this.useCase.execute({ id: Number(req.params.id) });

    return AcademicYearMapper.toDTO(data);
  }
}
