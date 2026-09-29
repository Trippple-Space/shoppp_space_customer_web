export type ProductSizeChartSource =
  | 'product'
  | 'vendor_template'
  | 'platform_default'
  | 'none';

export interface ProductSizeChartRow {
  key: string;
  label: string;
  values: Array<number | null>;
}

export interface ProductSizeChartAccessorySummary {
  necklaceLengthsCm?: number[];
  braceletLengthsCm?: number[];
  lensWidthMm?: number | null;
  bridgeMm?: number | null;
  templeMm?: number | null;
  shoeSizes?: string[];
  shoeScale?: 'EU' | 'UK' | 'US';
  headSizes?: string[];
}

export interface FootwearSizeChartRow {
  sizeLabel: string;
  eu: string;
  uk: string;
  us: string;
}

export interface ProductSizeChartResponse {
  showSizeChart?: boolean;
  available: boolean;
  title: string;
  archetypeName?: string | null;
  archetypeSlug?: string | null;
  source: ProductSizeChartSource;
  unit?: 'cm';
  sizeLabels: string[];
  measurementKeys: string[];
  rows: ProductSizeChartRow[];
  accessorySummary: ProductSizeChartAccessorySummary | null;
  footwearChart?: FootwearSizeChartRow[] | null;
  note?: string | null;
  matchConfidence?: 'vendor' | 'inferred' | 'none';
}

export type ProductFitSizeChart =
  | ProductSizeChartResponse
  | { showSizeChart: boolean };
