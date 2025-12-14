import { IRole } from 'types';

export interface IGetRolesOptions {
  codes?: string[];
  ids?: number[];
  relations?: Array<`permissions` | `users`>;
}

export interface IRoleRepo {
  get(dto: IGetRolesOptions): Promise<IRole[]>;
}
export const IRoleRepo = Symbol.for(`IRoleRepo`);
