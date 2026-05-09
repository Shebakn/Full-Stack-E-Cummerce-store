
export interface ProductQuery {
  page?: number;
  limit?: number;
  includeChildren?: boolean;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  orderBy?: string;
  orderDirection?: 'asc' | 'desc';
  brandId?: number;
}
