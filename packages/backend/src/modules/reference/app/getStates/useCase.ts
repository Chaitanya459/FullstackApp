import { IState, IUseCase } from 'types';
import { inject, injectable } from 'inversify';
import { IStateRepo } from '../repos';

@injectable()
export class GetStatesUseCase implements IUseCase<void, IState[]> {
  public constructor(
    @inject(IStateRepo) private readonly stateRepo: IStateRepo,
  ) {}

  public async execute(): Promise<IState[]> {
    const states = await this.stateRepo.get();

    return states;
  }
}
