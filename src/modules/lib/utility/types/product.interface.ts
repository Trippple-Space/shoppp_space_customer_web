import { Store } from "./store.interface";

export interface ProductCategory {
    id: number;
    name: string;
    images: string[];
    description: string | null;
  }
  
  export interface Product {
    keywords: string[];
    id: number;
    slug: string;
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
    incrementBy: number;
    product: Product;
    meta: null | any;
    properties: null | any;
    stockUnit: string;
    dateCreated: string;
    lastUpdated: string;
  }
  