export interface IPageQuery {
  limit: number;
  page: number;
}

export interface IPaginatedResponse<T> {
  data: T[];
  total: number;
}
