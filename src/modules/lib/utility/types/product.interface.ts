import { Store } from "./store.interface";

export interface ProductCategory {
  type: string;
  id: number;
  name: string;
  images: string[];
  description: string | null;
}

export interface Product {
  longDescription: string;
  keywords: string[];
  id: number;
  slug: string;
  category: ProductCategory;
  price: number;
  type: string;
  name: string;
  stockUnit: string;
  status: number;
  dateCreated: string;
  lastUpdated: string;
  reviewRating: number;
  reviews: any;
  comments: any;
  variants: ProductVariant[];
  store: Store;
  tags: Tag[];
}

export interface ProductMedia {
  url: string;
  type: "image" | "video";
  description?: string;
  caption?: string;
}

export interface ProductVariant {
  id: number;
  media: ProductMedia[];
  stock: number;
  price: number;
  minPurchaseQuantity: number;
  incrementBy: number;
  product: Product;
  meta: null | any;
  properties: null | any;
  stockUnit: string;
  dateCreated: string;
  lastUpdated: string;
};

export interface Tag {
  label: string;
}