import { IUser } from 'types';

export interface IGetUsersOptions {
  email?: string;
  name?: string;
  role?: string;

  withDeleted?: boolean;
  withPermissions?: boolean;
}

export interface IUserRepo {
  exists(email: string, id?: number): Promise<boolean>;
  getById(userId: number, opts?: IGetUsersOptions): Promise<IUser>;
  search(query?: IGetUsersOptions): Promise<IUser[]>;
  getByEmailWithPassword(email: string): Promise<IUser> | null;
  getByEmail(email: string): Promise<IUser | null>;
  update(user: Partial<IUser>, updatedBy: number): Promise<IUser>;
  create(user: IUser, createdBy: number): Promise<IUser>;
  delete(user: number, deletedBy: number): Promise<void>;
  restore(user: number, updatedBy: number): Promise<void>;
  setRoles(userId: number, roleIds: number[], actorId: number): Promise<void>;
  setServiceTypeGroups(userId: number, serviceTypeGroupIds: number[], actorId: number): Promise<void>;
  setServiceTypes(userId: number, serviceTypeIds: number[], actorId: number): Promise<void>;
}
export const IUserRepo = Symbol.for(`IUserRepo`);
