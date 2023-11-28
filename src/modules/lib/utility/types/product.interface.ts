import { Store } from "./store.interface";

export interface ProductCategory {
    id: number;
    name: string;
    images: string[];
    description: string | null;
  }
  
  export interface Product {
    id: number;
    category: ProductCategory;
    price: number;
    name: string;
    stockUnit: string;
    status: number;
    dateCreated: string;
    lastUpdated: string;
    variants: ProductVariant[];
    store: Store
  }

  export interface ProductMedia {
    url: string;
    type: 'image' | 'video';
    description?: string;
    caption?: string;
  }
  
  export interface ProductVariant {
    id: number;
    media: ProductMedia[];
    stock: number;
    price: number;
    minPurchaseQuantity: number;
    meta: null | any;
    stockUnit: string;
    dateCreated: string;
    lastUpdated: string;
  }
  