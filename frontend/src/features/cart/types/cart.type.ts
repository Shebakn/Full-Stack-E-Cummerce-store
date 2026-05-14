export interface CartProduct {
  id: string;
  title: string;

  imageCover?: {
    original: string;
  };

  category?: {
    name: string;
  };
}

export interface CartVariant {
  id?: string;
  price?: number;

  attributes?: {
    name: string;
    value: string;
  }[];
}

export interface CartItem {
  id: string;

  productId: string;
  variantId?: string;

  quantity: number;

  price: number; // unitPrice من backend

  product?: CartProduct;
  variant?: CartVariant;
}

export interface CartData {
  id: string;
  userId: string;

  cartItems: CartItem[];

  totalPrice: number;
  totalPriceAfterDiscount: number;

  couponId?: string | null;

  _count: {
    cartItems: number;
  };
}

export interface CartResponse {
  data: CartData;
  meta?: {
    message?: string;
  };
}