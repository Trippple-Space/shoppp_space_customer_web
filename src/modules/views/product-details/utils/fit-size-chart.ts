import type {
  ProductFitSizeChart,
  ProductSizeChartResponse,
} from '../types/product-size-chart';

export const isFullProductSizeChart = (
  value: ProductFitSizeChart | null | undefined,
): value is ProductSizeChartResponse =>
  Boolean(
    value &&
      typeof value === 'object' &&
      'available' in value &&
      'sizeLabels' in value &&
      'rows' in value,
  );

export const shouldShowProductSizeChart = (
  value: ProductFitSizeChart | null | undefined,
) => {
  if (!value) return true;
  if (value.showSizeChart === false) return false;
  return !isFullProductSizeChart(value) || value.available;
};
