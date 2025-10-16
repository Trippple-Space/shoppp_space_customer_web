import { ProductVariant } from "./product.interface";

export interface Cart {
  id: string;
  userId: string;
  subTotal: number;
  total: number;
  cartItems: CartItem[]
  totalDiscountedPrice: number;
  discountValue: number;
  discountedPrice: number;
  totalDiscountValue: number;
  meta: any | null;
  createAt: string;
  lastUpdated: string;
  storeGroups: StoreGroupResponse[];
  systemDiscountCode: string;
  systemDiscountValue: number
}

export interface CartItem {
  id: string,
  productId: string,
  quantity: number;
  sizes?: {
    quantity: number;
    size: string
  }[];
  variant: ProductVariant;
  totalPrice: number;
  discountedPrice: number;
  createAt: string;
  discountValue: number;
  lastUpdated: string;
  meta: any | null;

}

export interface BuyAgain {
  variantId: string
  quantity: number
  size?: string[]
}

export interface StoreGroupResponse {
  id: string;
  storeSubTotal: number;
  storeTotal: number;
  storeDiscountedTotal: number;
  storeDiscountValue: number;
  discountCode: string | null;
  meta: any | null;
  createAt: string;
  lastUpdated: string;
  store: StoreResponse;
  items: CartItem[];
}

export interface StoreResponse {
  id: string;
  slug: string;
  type: string | null;
  status: string;
  name: string;
  thumbnail: string;
  description: string;
  heading: string;
  subHeading: string;
  categories: string[];
  meta: StoreMeta;
  createAt: string;
  lastUpdated: string;
}

export interface StoreMeta {
  heroImage1: string;
  heroImage2: string;
  heroImage3: string;
  heroImage4: string;
  settings: StoreSettings;
  financials: FinancialDetails[];
}

export interface StoreSettings {
  workingHours: {
    opening: string;
    closing: string;
  };
}

export interface FinancialDetails {
  bankName: string;
  accountName: string;
  accountNumber: string;
  isConnected: boolean;
  imageUrl: string;
}
