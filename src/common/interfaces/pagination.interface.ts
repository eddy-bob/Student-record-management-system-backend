export interface PaginatedResponse<T> {
  items: T[];
  meta: {
    totalPages: number;
    page: number;
    lastPage: number;
  };
}
