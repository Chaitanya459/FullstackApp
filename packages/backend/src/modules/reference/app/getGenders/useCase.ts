import { IGender, IUseCase } from 'types';
import { inject, injectable } from 'inversify';
import { IGenderRepo } from '../repos';

@injectable()
export class GetGendersUseCase implements IUseCase<void, IGender[]> {
  public constructor(
    @inject(IGenderRepo) private readonly gendersRepo: IGenderRepo,
  ) {}

  public async execute(): Promise<IGender[]> {
    const genders = await this.gendersRepo.get();

    return genders;
  }
}
