import { IAcademicYear } from 'types';

export interface IAcademicYearRepo {
  get(): Promise<IAcademicYear[]>;
  getById(id: number): Promise<IAcademicYear>;
  create(data: Omit<IAcademicYear, `id`>): Promise<IAcademicYear>;
}

export const IAcademicYearRepo = Symbol.for(`IAcademicYearRepo`);
