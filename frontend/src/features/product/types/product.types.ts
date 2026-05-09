export type ProductImage = {
  url: {
    original: string;
    small: string;
    medium: string;
    large: string;
  };
  position: number;
};

export type VariantAttribute = {
  name: string;
  value: string;
};

export type Variant = {
  id: string;
  price: string;
  stock: number;
  attributes: VariantAttribute[];
};

export type Review = {
  id: string;
  reviewText?: string;
  rating: number;
  user: {
    name: string;
    avatar?: string | null;
  };
  createdAt?: string;
};

export type NewReview = {
  rating: number;
  reviewText: string;
  productId: string;
};

export type Product = {
  id: string;
  title: string;
  description: string;
  price: number;
  imageCover: {
    original: string;
  };
  images: ProductImage[];
  variants: Variant[];
  reviews: Review[];
  reviewsCount: number;
  ratingsAverage: number;
  brand?: {
    name: string;
  } | null;
};

export type ApiResponse<T> = {
  status: string;
  data: T;
};