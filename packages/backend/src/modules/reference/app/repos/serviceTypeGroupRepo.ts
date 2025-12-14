import { IServiceTypeGroup } from 'types';

export interface IServiceTypeGroupRepo {
  get(): Promise<IServiceTypeGroup[]>;
}

export const IServiceTypeGroupRepo = Symbol.for(`IServiceTypeGroupRepo`);
