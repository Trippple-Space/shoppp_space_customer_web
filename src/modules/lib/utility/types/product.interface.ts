import { Store } from "./store.interface";
import type { ProductFitSizeChart } from "@/modules/views/product-details/types/product-size-chart";

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
  isVisualDiscount?: boolean,
  createdAt: string,
  updatedAt: string
}

export interface ProductCatalogue {
  id: string;
  createdAt: string;
  updatedAt: string;
  productId: string;
  vendorId: string;
  mediaUrl: string;
  mediaType: 'image' | 'video';
  thumbnailUrl: string | null;
  caption: string | null;
  displayOrder: number;
  status: string;
  rejectionReason: string | null;
  source: string;
  isVerified: boolean;
  isCelebrityClaimed: boolean;
  occasionType: string | null;
  locationType: string | null;
  featuredPersonType: string | null;
  eventScale: string | null;
  engagementScore: number;
  aiTags: unknown;
  aiConfidenceScore: unknown;
  detectedProductIds: unknown;
  geoLocation: unknown;
  trendScore: unknown;
  deletedAt: string | null;
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
  meta: any;
  productCatalogues?: ProductCatalogue[];
  fitSizeChart?: ProductFitSizeChart;
}

export interface ProductsResponse {
  data: Product[];
  meta: {
    totalItems: number;
    itemCount: number;
    itemsPerPage: number;
    totalPages: number;
    currentPage: number;
  };
}

export interface ProductMedia {
  url: string;
  type: "image" | "video";
  description?: string;
  caption?: string;
  uploadUrl?: string;
  uploadURL?: string;
  upload_url?: string;
  sharedUploadUrl?: string;
  sourceUrl?: string;
  originalUrl?: string;
}

export interface ProductVariant {
  id: string;
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
  createAt: string;
  lastUpdated: string;
  preOrder?: boolean;
  configurationRecords?: ConfigurationRecord[];
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
  tags?: string | string[]
}

export interface RecentlyViewedResponse {
  data: RecentlyViewed[]
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

//product configurations
export interface ConfigurationRecord {
  configurationRecordSchemaId: string;
  id: string;
  storeId: string;
  tagDefinition: string | null;
  name: string;
  slug: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  isActive: boolean;
  customerDataForm: ConfigurationRecordCustomerDataField[];
}

export interface ConfigurationRecordCustomerDataField {
  keyFormat: ConfigurationRecordCustomerDataFieldKeyFormat;
  valueFormat: ConfigurationRecordCustomerDataFieldValueFormat;
}

export interface ConfigurationRecordCustomerDataFieldKeyFormat {
  fieldName: string;
  type: string;
  defaultValue: string;
  readonly: boolean;
}

export interface ConfigurationRecordCustomerDataFieldValueFormat {
  fieldName: string;
  type: string;
  required: boolean;
  description: string;
  example?: string | null;
  placeholder?: string | null;
  defaultValue?: unknown;
  readonly?: boolean | null;
  targetUserType?: string | null;
}