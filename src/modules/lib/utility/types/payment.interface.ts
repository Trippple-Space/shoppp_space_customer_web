
export interface PaymentResult {
  message?: string;
  paymentLink: string;
}

export interface ShareLinkResponse {
  paymentId: string;
  shareToken: string;
  sharePath: string;
  frontendCheckoutPathHint: string;
}

export interface SharedCheckoutItem {
  quantity: number;
  lineTotal: number;
  productName: string;
  productSlug: string;
  variantId: string;
  variantImage?: string | null;
  size: string | Record<string, string | number | boolean> | null;
  properties?: Record<string, unknown> | null;
}

export interface SharedCheckoutStore {
  storeId: string;
  storeName: string;
  storeSlug: string;
  items: SharedCheckoutItem[];
}

export interface SharedCheckoutSummaryResponse {
  status: string;
  paid: boolean;
  sharedByFirstName?: string;
  message: string;
  deliveryOption: string;
  totalToPaySmallestUnit: number;
  cartSubTotal: number;
  cartTotal: number;
  deliveryFee: number;
  stores: SharedCheckoutStore[];
}

export interface SharedPaystackRequest {
  email: string;
}

export interface SharedPaystackResponse {
  paymentLink: string;
  reference: string;
  accessCode: string;
  paymentId: string;
}
