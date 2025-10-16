import { Store } from "./store.interface";

export interface ICategory {
  name: string;
  filters: {
    [x: string]: any;
  };
  images: {
    icon: string;
    picture: string;
  };
  description: string | null;
  subcategories: ICategory[];
}

export interface ProductCategory {
  name?: any;
  id: string;
  label: string;
  type: "wears" | "fabrics" | null;
  categories: ICategory[];
  storeId: string;
}

export interface Discount {
  id: string,
  title: string,
  discountCode: string,
  discountType: string,
  discountCalculationType: string,
  value: number,
  activeStartDate: string,
  activeEndDate: string,
  status: string,
  minOrderAmount: number | string,
  minOrderQuantity: number | string,
  channel: string[],
  createdAt: string,
  updatedAt: string
}

export interface Product {
  longDescription: string;
  shortDescription: string;
  keywords: string[];
  id: string;
  slug: string;
  price: number;
  discountedPrice?: number
  finalPrice?: number;
  type: string;
  name: string;
  stockUnit: string;
  status: number;
  createAt: string;
  lastUpdated: string;
  reviewRating: number;
  reviews: any;
  comments: any;
  variants: ProductVariant[];
  store: Store;
  availableUnit?: any[];
  tags: Tag[];
  discount: Discount
}

export interface ProductMedia {
  url: string;
  type: "image" | "video";
  description?: string;
  caption?: string;
}

export interface ProductVariant {
  id: string;
  media: ProductMedia[];
  stock: number;
  price: number;
  size: {
    size: string;
    quantity: number | string;
    isAvailable: boolean
  }[];
  finalPrice: number;
  discountedPrice: number
  minPurchaseQuantity: number;
  incrementBy: number;
  product?: Product;
  status: string;
  meta: null | any;
  properties: null | any;
  stockUnit: string;
  createAt: string;
  lastUpdated: string;
  preOrder?: boolean;
}

export interface Tag {
  label: string;
}

export interface PillableProp {
  [x: string]: {
    active: boolean;
    pillColor: string;
    pillBackground: string;
    priority: number;
    text: string;
  };
}

export interface IFilters {
  sort: { sortBy: string };
  price: { min: string; max: string };
  rating: { rateBy: string };
  location: { selectedState: string };
  showOffers: boolean;
  tags?: string
}



export interface RecentlyViewed {
  id: string;
  productVariantId: string;
  userId: string;
  type: string;
  productVariant: ProductVariant;
  createdAt: string;
  updatedAt: string;
}