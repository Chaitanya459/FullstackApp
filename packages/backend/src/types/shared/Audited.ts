import { IUser } from '..';

export interface IAudited {
  createdAt: Date;
  createdBy: number;
  creator?: IUser;
  deletedAt?: Date;
  deletedBy?: number | null;
  deletor?: IUser;
  updatedAt: Date;
  updatedBy: number;
  updater?: IUser;
}
