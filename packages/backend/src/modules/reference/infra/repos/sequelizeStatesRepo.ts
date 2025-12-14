import { IState } from 'types';
import { injectable } from 'inversify';
import { IStateRepo } from '../../app/repos';
import { StateModel } from '../../../../infra/database/sequelize/models';

@injectable()
export class StateRepo implements IStateRepo {
  public async get(): Promise<IState[]> {
    const states = await StateModel.findAll();
    return states?.map((state) => state.get({ plain: true }));
  }
}
