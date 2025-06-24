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
  id: number;
  label: string;
  type: "wears" | "fabrics" | null;
  categories: ICategory[];
  storeId: number;
}

export interface Discount {
  id: number,
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
  id: number;
  slug: string;
  price: number;
  finalPrice?: number;
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
  id: number;
  media: ProductMedia[];
  stock: number;
  price: number;
  size: string;
  finalPrice: number;
  discountedPrice: number
  minPurchaseQuantity: number;
  incrementBy: number;
  product?: Product;
  status: string;
  meta: null | any;
  properties: null | any;
  stockUnit: string;
  dateCreated: string;
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
  id: number;
  productVariantId: number;
  userId: number;
  type: string;
  productVariant: ProductVariant;
  createdAt: string;
  updatedAt: string;
}