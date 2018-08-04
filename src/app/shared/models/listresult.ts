export interface IListResult<T> {
  items: T[];
  page: number;
  limit: number;
  total: number;
}
