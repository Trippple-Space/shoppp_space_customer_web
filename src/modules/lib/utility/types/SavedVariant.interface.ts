import { CartItem } from "./cart.interface";
import { ProductVariant } from "./product.interface";

export interface SavedVariant {
  id: string;
  variant: ProductVariant;
  savedAt: string;
  userId: string;
  variantId: string;
}