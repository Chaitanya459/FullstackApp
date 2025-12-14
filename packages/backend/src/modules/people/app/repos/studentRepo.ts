import { IStudent, IStudentMonthlySummary, IStudentSummary } from 'types';

export interface IGetStudentFilter {
  districtId?: number;
  endAt?: Date;
  requireDocumentation?: boolean;
  requireServiceAssignment?: boolean;
  serviceTypeGroupId?: number;
  startAt?: Date;
  therapistId?: number;
}

export interface IGetStudentMinutesFilter {
  endDate?: Date;
  startDate?: Date;
  therapistId: number;
  year?: string;
}

export interface IGetStudentByIdFilter {
  endDate?: string;
  serviceTypeGroupId?: number;
  startDate?: string;
  therapistId?: number;
}

export interface IStudentRepo {
  get(filter: IGetStudentFilter): Promise<IStudent[]>;
  getById(studentId: number, filter: IGetStudentByIdFilter): Promise<IStudent>;
  getSummary(filter: IGetStudentMinutesFilter): Promise<IStudentSummary[]>;
  getMonthlySummary(filter: IGetStudentMinutesFilter): Promise<IStudentMonthlySummary[]>;
}

export const IStudentRepo = Symbol.for(`IStudentRepo`);
