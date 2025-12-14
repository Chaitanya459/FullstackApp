import { IGradeLevel } from 'types';

export interface IGradeLevelRepo {
  get(): Promise<IGradeLevel[]>;
}

export const IGradeLevelRepo = Symbol.for(`IGradeLevelsRepo`);
