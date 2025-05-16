import { ProductVariant } from "./product.interface";

export interface Cart {
    id: number;
    userId: number;
    subTotal: number;
    total: number;
  cartItems: CartItem[]
  totalDiscountedPrice: number;
  discountValue: number;
  discountedPrice: number;
  totalDiscountValue: number;
  meta: any | null;
  dateCreated: string;
  lastUpdated: string;
  storeGroups: StoreGroupResponse[];  
}

export interface CartItem {
    id: number,
    productId: string,
    quantity: number,
    variant: ProductVariant,
    totalPrice: number
}

export interface BuyAgain {
    variantId: number
    quantity: number
}

export interface StoreGroupResponse {
  id: number;
  storeSubTotal: number;
  storeTotal: number;
  storeDiscountedTotal: number;
  storeDiscountValue: number;
  
  discountCode: string | null;
  meta: any | null;
  dateCreated: string;
  lastUpdated: string;
  store: StoreResponse;
  items: CartItem[];
}

export interface StoreResponse {
  id: number;
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
  dateCreated: string;
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
