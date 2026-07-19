export interface PagedResponse<T> {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface CategoryResponse {
  id: number;
  name: string;
  description?: string;
}

export interface BrandResponse {
  id: number;
  name: string;
  logo?: string;
}
