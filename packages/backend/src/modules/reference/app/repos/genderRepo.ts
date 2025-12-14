import { IGender } from 'types';

export interface IGenderRepo {
  get(): Promise<IGender[]>;
}

export const IGenderRepo = Symbol.for(`IGendersRepo`);
