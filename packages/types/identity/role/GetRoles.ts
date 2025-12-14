export interface GetRolesDTO {
  codes?: string[];
  ids?: number[];
  relations?: Array<`permissions` | `users`>;
}
