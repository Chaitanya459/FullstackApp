import { IServiceType, IServiceTypeReport } from 'types';

export interface IServiceTypeRepo {
  get(): Promise<IServiceType[]>;
  getReport(): Promise<IServiceTypeReport[]>;
}

export const IServiceTypeRepo = Symbol.for(`IServiceTypeRepo`);
