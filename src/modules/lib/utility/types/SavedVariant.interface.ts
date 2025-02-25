import { CartItem } from "./cart.interface";
import { ProductVariant } from "./product.interface";

export interface SavedVariant {
  id: number;
  variant: ProductVariant;
  savedAt: string;
  userId: number;
  variantId: number;
}