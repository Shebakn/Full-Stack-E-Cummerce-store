export type Product = {
  id: string;

  title: string;

  description: string;

  price: number;

  imageCover: {
    original: string;
    small: string;
    medium: string;
    large: string;
  } | null;

  sold: number;

  ratingsAverage: number;

  ratingsQuantity: number;

  category: {
    id: string;
    name: string;
  } | null;

  brand: any;

  images: any[];

  variants: any[];

  reviews: any[];
};

export type Meta = {
  total: number;

  page: number;

  limit: number;

  totalPages: number;
} | null;

export type ProductsResponse = {
  data: Product[];

  meta: Meta;
};

export type ProductQuery = {
  page?: number;

  limit?: number;

  search?: string;

  categoryId?: string;

  categoryIds?: string[];

  brandId?: string;

  minPrice?: number;

  maxPrice?: number;

  ratings?: number[];

  orderBy?:
    | "createdAt"
    | "price"
    | "ratingsAverage";

  orderDirection?: "asc" | "desc";

  includeChildren?: boolean;
};