import { IState } from 'types';

export interface IStateRepo {
  get(): Promise<IState[]>;
}

export const IStateRepo = Symbol.for(`IStateRepo`);
