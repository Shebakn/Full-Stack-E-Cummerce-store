export interface Product {
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
}