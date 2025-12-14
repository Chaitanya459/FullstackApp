import { IGradeLevel, IUseCase } from 'types';
import { inject, injectable } from 'inversify';
import { IGradeLevelRepo } from '../repos';

@injectable()
export class GetGradeLevelsUseCase implements IUseCase<void, IGradeLevel[]> {
  public constructor(
    @inject(IGradeLevelRepo)
    private readonly gradeLevelsRepo: IGradeLevelRepo,
  ) {}

  public async execute(): Promise<IGradeLevel[]> {
    const gradeLevels = await this.gradeLevelsRepo.get();

    return gradeLevels;
  }
}
