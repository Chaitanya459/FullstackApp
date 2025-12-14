import { inject, injectable } from 'inversify';
import { IUseCase } from 'types';
import arrify from 'arrify';
import { IDistrict } from '../../../../types/organization/District';
import { IDistrictRepo } from '../repos';

export interface IGetDistrictsInput {
  id?: number;
}

@injectable()
export class GetDistrictsUseCase implements IUseCase<IGetDistrictsInput, IDistrict[]> {
  public constructor(
    @inject(IDistrictRepo) private readonly districtRepo: IDistrictRepo,
  ) {}

  public async execute({ id }: IGetDistrictsInput): Promise<IDistrict[]> {
    return await this.districtRepo.get({
      ids: arrify(id),
    });
  }
}
